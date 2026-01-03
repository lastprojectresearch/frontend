import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyAlertScreen({ route }) {
  // ✅ SAFE PARAMS (NO CRASH EVEN IF EMPTY)
  const {
    driverName = 'Kamal Perera',
    phone = '+94 77 2903 965',
    passengers = 4,
    ambulances = 2,
    location = 'Galle Road, Colombo 03',
  } = route?.params || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>

        {/* SEVERITY */}
        <View style={styles.severityRow}>
          <View style={styles.dot} />
          <Text style={styles.severityText}>HIGH SEVERITY</Text>
        </View>

        <Text style={styles.time}>
          {new Date().toLocaleString()}
        </Text>

        {/* DRIVER */}
        <Text style={styles.section}>DRIVER INFORMATION</Text>
        <Text style={styles.driverName}>{driverName}</Text>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.callText}>{phone}</Text>
        </TouchableOpacity>

        {/* LOCATION */}
        <Text style={styles.section}>ACCIDENT LOCATION</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color="#EF4444" />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() =>
            Linking.openURL(
              'https://www.google.com/maps/search/?api=1&query=Galle+Road+Colombo'
            )
          }
        >
          <Ionicons name="map" size={18} color="#fff" />
          <Text style={styles.mapText}>View on Google Maps</Text>
        </TouchableOpacity>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.passengerBox]}>
            <Text style={styles.statLabel}>Passengers</Text>
            <Text style={styles.passengerValue}>{passengers}</Text>
          </View>

          <View style={[styles.statBox, styles.ambulanceBox]}>
            <Text style={styles.statLabel}>Ambulances</Text>
            <Text style={styles.ambulanceValue}>{ambulances}</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  card: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
  },

  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  severityText: {
    fontWeight: '800',
    color: '#EF4444',
  },

  time: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },

  section: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },

  driverName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  callBtn: {
    marginTop: 10,
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  callText: {
    color: '#fff',
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontWeight: '600',
    color: '#111827',
  },

  mapBtn: {
    marginTop: 14,
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  mapText: {
    color: '#fff',
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#374151',
  },

  passengerBox: {
    backgroundColor: '#DCFCE7',
  },
  passengerValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22C55E',
  },

  ambulanceBox: {
    backgroundColor: '#FEE2E2',
  },
  ambulanceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#EF4444',
  },
});
