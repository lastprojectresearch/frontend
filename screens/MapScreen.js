import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import BottomHazardCard from '../components/BottomHazardCard';

const { width, height } = Dimensions.get('window');

const HAZARD_COLORS = {
  police: '#FF0000', // Red (unchanged)
  construction: '#FFFF00', // Yellow (unchanged)
  pothole: '#800080', // Purple (unchanged)
};

const hardcodedHazards = [
  { id: 1, type: 'police', latitude: 7.2090, longitude: 79.8365, timestamp: new Date(Date.now() - 14 * 3600000), image: 'https://picsum.photos/100/100?random=1' },
  { id: 2, type: 'construction', latitude: 7.2075, longitude: 79.8350, timestamp: new Date(Date.now() - 12 * 3600000), image: 'https://picsum.photos/100/100?random=2' },
  { id: 3, type: 'pothole', latitude: 7.2085, longitude: 79.8370, timestamp: new Date(Date.now() - 10 * 3600000), image: 'https://picsum.photos/100/100?random=3' },
  { id: 4, type: 'police', latitude: 7.2100, longitude: 79.8360, timestamp: new Date(Date.now() - 8 * 3600000), image: 'https://picsum.photos/100/100?random=4' },
  { id: 5, type: 'construction', latitude: 7.2060, longitude: 79.8345, timestamp: new Date(Date.now() - 6 * 3600000), image: 'https://picsum.photos/100/100?random=5' },
  { id: 6, type: 'pothole', latitude: 7.2095, longitude: 79.8380, timestamp: new Date(Date.now() - 4 * 3600000), image: 'https://picsum.photos/100/100?random=6' },
  { id: 7, type: 'police', latitude: 7.2110, longitude: 79.8375, timestamp: new Date(Date.now() - 2 * 3600000), image: 'https://picsum.photos/100/100?random=7' },
  { id: 8, type: 'construction', latitude: 7.2055, longitude: 79.8365, timestamp: new Date(Date.now() - 1 * 3600000), image: 'https://picsum.photos/100/100?random=8' },
  { id: 9, type: 'pothole', latitude: 7.2080, longitude: 79.8340, timestamp: new Date(Date.now() - 3 * 3600000), image: 'https://picsum.photos/100/100?random=9' },
  { id: 10, type: 'police', latitude: 7.2105, longitude: 79.8355, timestamp: new Date(Date.now() - 5 * 3600000), image: 'https://picsum.photos/100/100?random=10' },
];

const DESTINATION = { latitude: 7.2167, longitude: 79.8333 }; // Negombo Beach

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your key

function decodePolyline(encoded) {
  let index = 0, lat = 0, lng = 0;
  const polyline = [];
  while (index < encoded.length) {
    let shift = 0, result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    polyline.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
  }
  return polyline;
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

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

  const calculateDistance = (hazard) => {
    if (!location) return 'Unknown';
    const distMeters = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: hazard.latitude, longitude: hazard.longitude }
    );
    return (distMeters / 1000).toFixed(1) + ' km';
  };

  const handleAvoid = async (hazard) => {
    if (!location) return;
    
    const detourWaypoint = `${hazard.latitude},${hazard.longitude + 0.005}`;
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${DESTINATION.latitude},${DESTINATION.longitude}&waypoints=${detourWaypoint}&key=${GOOGLE_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const points = data.routes[0].overview_polyline.points;
        const coords = decodePolyline(points);
        setRouteCoords(coords);
      } else {
        console.error('Directions API error:', data.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    
    setSelectedHazard(null);
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
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : {
        latitude: 7.2083,
        longitude: 79.8358,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={region} provider="google">
        {location && (
          <>
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              pinColor="cyan"
              title="You are here"
            />
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={200}
              strokeColor="rgba(0, 255, 255, 0.5)"
              fillColor="rgba(0, 255, 255, 0.2)"
            />
          </>
        )}
        {hardcodedHazards.map((hazard) => (
          <Marker
            key={hazard.id}
            coordinate={{ latitude: hazard.latitude, longitude: hazard.longitude }}
            pinColor={HAZARD_COLORS[hazard.type]}
            onPress={() => setSelectedHazard(hazard)}
          />
        ))}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.topBar}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.profilePic}
        />
        <Text style={styles.greeting}>{greeting}</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'cyan' }]} />
          <Text style={styles.legendText}>Current location</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF0000' }]} />
          <Text style={styles.legendText}>Police</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFFF00' }]} />
          <Text style={styles.legendText}>Construction Zone</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#800080' }]} />
          <Text style={styles.legendText}>Bad condition (Pothole)</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <Text style={styles.recenterText}>Recenter</Text>
      </TouchableOpacity>

      <BottomHazardCard
        selectedHazard={selectedHazard}
        onClose={() => setSelectedHazard(null)}
        calculateDistance={calculateDistance}
        onAvoid={handleAvoid}
      />

      {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' // Background: Light Gray
  },
  map: { width, height },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Secondary: Slate Blue
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  greeting: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#F8FAFC' // Light text for contrast on Secondary
  },
  legend: {
    position: 'absolute',
    top: height / 2,
    right: 10,
    backgroundColor: '#1E293B', // Secondary: Slate Blue
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: {
    color: '#F8FAFC' // Light text for contrast
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#22C55E', // Accent: Green
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  recenterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC' // Light text
  },
  errorMsg: {
    color: '#EF4444', // Danger: Red
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center'
  }
});