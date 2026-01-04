import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { computeDestinationPoint } from 'geolib';

export default function Smap() {

  // 🔴 Blind bend coordinates (Kandy → Panadura)
  const blindBends = [
    { latitude: 7.268417, longitude: 80.597861 },
    { latitude: 7.267806, longitude: 80.596722 },
    { latitude: 7.265861, longitude: 80.592278 },
    { latitude: 7.265750, longitude: 80.592639 },
    { latitude: 7.265028, longitude: 80.586056 },
    { latitude: 7.264389, longitude: 80.586861 },
    { latitude: 7.266222, longitude: 80.553056 },
    { latitude: 7.263528, longitude: 80.544833 },
    { latitude: 7.262389, longitude: 80.531444 },
    { latitude: 7.251500, longitude: 80.509000 },
    { latitude: 7.253417, longitude: 80.500750 },
    { latitude: 7.256278, longitude: 80.489778 },
    { latitude: 7.247167, longitude: 80.464944 },
    { latitude: 7.250000, longitude: 80.420028 },
    { latitude: 7.251444, longitude: 80.323417 },
    { latitude: 7.237667, longitude: 80.270500 },
    { latitude: 7.183167, longitude: 80.148778 },
    { latitude: 7.109028, longitude: 80.049500 },
    { latitude: 6.973417, longitude: 80.002056 },
    { latitude: 6.907750, longitude: 79.929194 },
    { latitude: 6.856528, longitude: 79.892583 },
    { latitude: 6.825306, longitude: 79.883667 },
  ];

  // 📏 Create FILLED road danger patch (5m left/right, 10m length)
  const createRoadPatch = (point) => {
    const forward = computeDestinationPoint(point, 5, 0);
    const backward = computeDestinationPoint(point, 5, 180);

    const fLeft = computeDestinationPoint(forward, 5, 270);
    const fRight = computeDestinationPoint(forward, 5, 90);
    const bLeft = computeDestinationPoint(backward, 5, 270);
    const bRight = computeDestinationPoint(backward, 5, 90);

    return [
      { latitude: fLeft.latitude, longitude: fLeft.longitude },
      { latitude: fRight.latitude, longitude: fRight.longitude },
      { latitude: bRight.latitude, longitude: bRight.longitude },
      { latitude: bLeft.latitude, longitude: bLeft.longitude },
    ];
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.15,
          longitude: 80.30,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {/* 🔴 Blind bend danger road areas */}
        {blindBends.map((point, index) => (
          <Polygon
            key={index}
            coordinates={createRoadPatch(point)}
            fillColor={styles.dangerFill.color}
            strokeColor={styles.dangerStroke.color}
            strokeWidth={10}
          />
        ))}
      </MapView>
    </View>
  );
}

/* 🎨 STYLES (THEME INSIDE CSS ONLY) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Background
  },
  map: {
    flex: 1,
  },

  /* 🔴 Danger zone colors */
  dangerFill: {
    color: 'rgba(239, 68, 68, 0.55)', // EF4444 (Red)
  },
  dangerStroke: {
    color: '#EF4444',
  },

  
});
