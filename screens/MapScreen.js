import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import io from 'socket.io-client';
import BottomHazardCard from '../components/BottomHazardCard';

const { width, height } = Dimensions.get('window');

const HAZARD_COLORS = {
  police: '#FF0000',
  construction: '#FFFF00',
  pothole: '#800080',
};

const API_URL = 'http://10.63.70.158:8000';   // ← Update this IP when needed

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [nearbyAlert, setNearbyAlert] = useState(null); // For 100m alert

  const mapRef = useRef(null);
  const lastAlertTime = useRef(0);

  const fetchHazards = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/hazards`);
      const data = await response.json();

      const normalized = Array.isArray(data)
        ? data
            .filter(h => h.location?.coordinates?.length === 2)
            .map(h => ({
              id: h._id?._oid || h._id || String(h._id),
              type: h.hazard_type,
              latitude: Number(h.location.coordinates[1]),
              longitude: Number(h.location.coordinates[0]),
              timestamp: h.timestamp,
              expiration: h.expiration,
              confidence: h.confidence,
              accept_count: h.accept_count || 0,
              reject_count: h.reject_count || 0,
              location_source: h.location_source,
            }))
        : [];

      setHazards(normalized);
      checkNearbyHazards(normalized);
    } catch (err) {
      console.error('Fetch hazards error:', err);
      Alert.alert('Error', 'Failed to load hazards. Check backend connection.');
    }
  }, []);

  // Check for hazards within 100 meters
  const checkNearbyHazards = (currentHazards) => {
    if (!location) return;

    const now = Date.now();
    if (now - lastAlertTime.current < 30000) return; // Prevent spam (every 30 sec)

    const nearby = currentHazards.find(hazard => {
      const distMeters = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: hazard.latitude, longitude: hazard.longitude }
      );
      return distMeters <= 100;
    });

    if (nearby) {
      setNearbyAlert(`⚠️ Caution! ${nearby.type.toUpperCase()} hazard within 100m`);
      lastAlertTime.current = now;

      // Auto hide after 5 seconds
      setTimeout(() => setNearbyAlert(null), 5000);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc.coords);
    })();

    const hour = new Date().getHours();
    let greetText = 'Good Morning';
    if (hour >= 12 && hour < 18) greetText = 'Good Afternoon';
    else if (hour >= 18) greetText = 'Good Evening';
    setGreeting(`${greetText} Primal!`);
  }, []);

  useEffect(() => {
    fetchHazards();
    const interval = setInterval(fetchHazards, 30000);
    return () => clearInterval(interval);
  }, [fetchHazards]);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = io(API_URL, { transports: ['websocket'] });

    socket.on('connect', () => console.log('✅ Socket connected'));
    socket.on('connect_error', (err) => console.log('Socket error:', err.message));

    socket.on('new-hazard', () => {
      fetchHazards();
    });

    return () => socket.disconnect();
  }, [fetchHazards]);

  const calculateDistance = (hazard) => {
    if (!location) return 'Unknown';
    const distMeters = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: hazard.latitude, longitude: hazard.longitude }
    );
    return (distMeters / 1000).toFixed(1);
  };

  const handleVote = async (id, voteType) => {
    try {
      const response = await fetch(`${API_URL}/hazards/${id}/${voteType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          `Your feedback has been saved successfully!`,
          [{ text: 'OK' }]
        );
        await fetchHazards();           // Refresh counts
        if (data.deleted) setSelectedHazard(null);
      }
    } catch (err) {
      console.error('Vote error:', err);
      Alert.alert('Error', 'Failed to submit vote.');
    }
  };

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  const region = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : { latitude: 7.2083, longitude: 79.8358, latitudeDelta: 0.02, longitudeDelta: 0.02 };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={region} provider="google">
        {location && (
          <>
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} pinColor="cyan" title="You are here" />
            <Circle center={location} radius={200} strokeColor="rgba(0,255,255,0.5)" fillColor="rgba(0,255,255,0.2)" />
          </>
        )}

        {hazards.map(hazard => (
          <Marker
            key={hazard.id}
            coordinate={{ latitude: hazard.latitude, longitude: hazard.longitude }}
            pinColor={HAZARD_COLORS[hazard.type] || 'gray'}
            onPress={() => setSelectedHazard(hazard)}
          />
        ))}
      </MapView>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.profilePic} />
        <Text style={styles.greeting}>{greeting}</Text>
      </View>

      {/* Nearby Hazard Alert */}
      {nearbyAlert && (
        <View style={styles.nearbyAlert}>
          <Text style={styles.nearbyAlertText}>{nearbyAlert}</Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: 'cyan' }]} /><Text style={styles.legendText}>Current Location</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FF0000' }]} /><Text style={styles.legendText}>Police</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FFFF00' }]} /><Text style={styles.legendText}>Construction</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#800080' }]} /><Text style={styles.legendText}>Pothole</Text></View>
      </View>

      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <Text style={styles.recenterText}>Recenter</Text>
      </TouchableOpacity>

      <BottomHazardCard
        selectedHazard={selectedHazard}
        onClose={() => setSelectedHazard(null)}
        calculateDistance={calculateDistance}
        onVote={handleVote}
      />

      {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  map: { width, height },

  topBar: {
    position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B', padding: 10, borderRadius: 20, zIndex: 10,
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },

  nearbyAlert: {
    position: 'absolute', top: 110, left: 20, right: 20,
    backgroundColor: '#EF4444', padding: 12, borderRadius: 12,
    alignItems: 'center', zIndex: 20, elevation: 5,
  },
  nearbyAlertText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },

  legend: { position: 'absolute', top: height / 2, right: 10, backgroundColor: '#1E293B', padding: 10, borderRadius: 10, zIndex: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { color: '#F8FAFC' },

  recenterButton: {
    position: 'absolute', bottom: 100, right: 20,
    backgroundColor: '#22C55E', padding: 10, borderRadius: 20, zIndex: 10,
  },
  recenterText: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },

  errorMsg: { color: '#EF4444', position: 'absolute', bottom: 150, alignSelf: 'center' },
});