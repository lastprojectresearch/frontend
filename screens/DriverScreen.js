import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function DriverScreen({ navigation }) {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: 'Detecting location...',
  });
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [passengers] = useState(4);

  /* LIVE TIME (ONLY ONE TIMER) */
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* LIVE GPS (SAFE CLEANUP) */
  useEffect(() => {
    if (!locationEnabled) return;

    let subscription;
    let isMounted = true;

    (async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted' || !isMounted) {
          setLocation({
            lat: null,
            lng: null,
            address: 'Location permission denied',
          });
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          async (pos) => {
            if (!isMounted) return;

            const { latitude, longitude } = pos.coords;

            const geo = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            const mainCity =
              geo[0]?.city ||
              geo[0]?.region ||
              geo[0]?.district ||
              'Unknown city';

            setLocation({
              lat: latitude,
              lng: longitude,
              address: `${mainCity}, ${geo[0]?.country || ''}`,
            });

            setLastUpdate(new Date());
          }
        );
      } catch (e) {
        // prevent crash
      }
    })();

    return () => {
      isMounted = false;
      subscription && subscription.remove();
    };
  }, [locationEnabled]);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.time}>{formatTime(time)}</Text>
        <Text style={styles.logo}>ANZEN</Text>
        <Text style={styles.subHeader}>
          Vehicle: LK-AB-1234 | Driver: Kamal Perera
        </Text>
      </View>

      {/* SAFE CARD */}
      <View style={styles.safeCard}>
        <View style={styles.iconCircleGreen}>
          <Feather name="shield" size={24} color="#22c55e" />
        </View>
        <View>
          <Text style={styles.safeTitle}>SAFE</Text>
          <Text style={styles.safeText}>All systems normal</Text>
        </View>
      </View>

      {/* PASSENGERS */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="people" size={24} color="#22c55e" />
            </View>
            <Text style={styles.cardTitle}>Detected Passengers</Text>
          </View>

          <View style={styles.countBoxGreen}>
            <Text style={styles.countText}>{passengers}</Text>
          </View>
        </View>
      </View>

      {/* LOCATION */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="location" size={24} color="#10b981" />
            </View>
            <Text style={styles.cardTitle}>Location Status</Text>
          </View>

          <TouchableOpacity
            onPress={() => setLocationEnabled(!locationEnabled)}
            style={[
              styles.toggle,
              locationEnabled ? styles.toggleOn : styles.toggleOff,
            ]}
          >
            <View
              style={[
                styles.dot,
                locationEnabled ? styles.dotOn : styles.dotOff,
              ]}
            />
            <Text style={styles.toggleText}>
              {locationEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.locationText}>{location.address}</Text>

        {location.lat && (
          <Text style={styles.coords}>
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Text>
        )}
      </View>

      {/* LAST UPDATED */}
      <View style={styles.footer}>
        <Ionicons name="time" size={18} color="#6b7280" />
        <Text style={styles.footerText}>
          Last updated: {formatTime(lastUpdate)}
        </Text>
      </View>

      {/* BOTTOM NAV (UI ONLY) */}
      <View style={styles.bottomNav}>
        <Ionicons name="map" size={24} color="#6b7280" />
        <Ionicons name="qr-code" size={24} color="#6b7280" />
        <Ionicons name="home" size={24} color="#2563eb" />
        <Ionicons name="alert-circle" size={24} color="#6b7280" />
        <Ionicons name="stats-chart" size={24} color="#6b7280" />
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },

  header: {
    backgroundColor: '#0f172a',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  time: { color: '#cbd5e1', marginBottom: 10 },
  logo: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subHeader: { color: '#cbd5e1', marginTop: 6 },

  safeCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircleGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  safeTitle: { color: '#16a34a', fontWeight: 'bold', fontSize: 18 },
  safeText: { color: '#4b5563' },

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: { fontWeight: '600', fontSize: 16 },

  countBoxGreen: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  countText: { fontSize: 36, fontWeight: 'bold' },

  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleOn: { backgroundColor: '#0f172a' },
  toggleOff: { backgroundColor: '#e5e7eb' },

  toggleText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },

  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOn: { backgroundColor: '#22c55e' },
  dotOff: { backgroundColor: '#9ca3af' },

  locationText: { marginTop: 10, color: '#374151' },
  coords: { marginTop: 4, fontSize: 12, color: '#6b7280' },

  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: { color: '#6b7280' },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
