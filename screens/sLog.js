import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SpeedMeter = ({ speed }) => (
  <View style={styles.meterWrapper}>
    <View style={styles.meterCircle}>
      <View style={styles.meterInnerGlow}>
        <Text style={styles.meterValue}>{speed}</Text>
        <Text style={styles.meterUnit}>km/h</Text>
      </View>
    </View>
    <Text style={styles.meterLabel}>Current Speed</Text>
  </View>
);

const formatTime = (hour) => `${hour.toString().padStart(2, '0')}:00`;

export default function LogScreen() {
  const [timeLabels, setTimeLabels] = useState([]);
  const [speedData, setSpeedData] = useState([]);

  const [blindSpotDanger, setBlindSpotDanger] = useState(4);
  const [blindBendDanger, setBlindBendDanger] = useState(2);
  const [trafficSignCount, setTrafficSignCount] = useState(11);

  const [currentSpeed, setCurrentSpeed] = useState(0);

  useEffect(() => {
    const hours = [];
    for (let h = 0; h <= 21; h += 3) hours.push(h);
    setTimeLabels(hours.map(formatTime));

    const generateData = (max) => hours.map(() => Math.floor(Math.random() * max));
    setSpeedData(generateData(200));

    const speedInterval = setInterval(() => {
      setCurrentSpeed(Math.floor(Math.random() * 120));
    }, 1000);

    return () => clearInterval(speedInterval);
  }, []);

  const safeData = (data) => data.map((v) => (Number.isFinite(v) ? v : 0));
  const chartWidth = Math.max(Dimensions.get('window').width - 40, 300);
  const chartHeight = 230;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* SPEED METER */}
      <Text style={styles.sectionTitle}>Speed Meter</Text>
      <SpeedMeter speed={currentSpeed} />

      {/* TODAY'S SUMMARY */}
      <Text style={styles.sectionTitle}>Today's Summary</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryLabel}>Average Speed</Text>
          <Text style={styles.summaryValue}>86 km/h</Text>
        </View>
      </View>

      {/* SPEED GRAPH */}
      <Text style={styles.sectionTitle}>Speed Graph</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: safeData(speedData) }],
          }}
          width={chartWidth}
          height={chartHeight}
          yAxisSuffix=" "
          fromZero
          chartConfig={{
            backgroundColor: '#1a0d2e',
            backgroundGradientFrom: '#1a0d2e',
            backgroundGradientTo: '#2d1655',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(161, 33, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.8})`,
            propsForLabels: { fontSize: 11 },
            propsForDots: { r: '5', strokeWidth: '3', stroke: '#a121f6', fill: '#fff' },
            paddingLeft: 10,
            paddingRight: 10,
          }}
          style={styles.chart}
          bezier
        />
      </View>

      {/* DANGER COUNTS */}
      <Text style={styles.sectionTitle}>Danger Counts</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryLabel}>Blind Spot Danger</Text>
          <Text style={styles.summaryValue}>{blindSpotDanger}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryLabel}>Blind Bend Danger</Text>
          <Text style={styles.summaryValue}>{blindBendDanger}</Text>
        </View>
      </View>

      {/* TRAFFIC SIGN COUNTS */}
      <Text style={styles.sectionTitle}>Traffic Sign Count</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryLabel}>Traffic Sign Detections</Text>
          <Text style={styles.summaryValue}>{trafficSignCount}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0118',
  },
  content: {
    paddingTop: 35,
    paddingBottom: 80,
    alignItems: 'center',
  },

  // SECTION TITLE
  sectionTitle: {
    fontSize: 25,
    color: '#ffffff',
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom: 20,
    marginTop: 30,
    textShadowColor: '#a121f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // SPEED METER
  meterWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  meterCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#a121f6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0d2e',
    shadowColor: '#a121f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  meterInnerGlow: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0a0118',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6b21a8',
  },
  meterValue: {
    fontSize: 52,
    color: '#ffffff',
    fontWeight: '900',
    textShadowColor: '#a121f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  meterUnit: {
    fontSize: 18,
    color: '#c084fc',
    marginTop: -4,
    fontWeight: '600',
  },
  meterLabel: {
    marginTop: 15,
    color: '#e9d5ff',
    fontSize: 17,
    fontWeight: '700',
  },

  // SUMMARY CARDS
  summaryCard: {
    width: '90%',
    backgroundColor: '#1a0d2e',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6b21a8',
    shadowColor: '#a121f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 20,
    color: '#e9d5ff',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '900',
    textShadowColor: '#a121f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // CHART
  chartContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    width: '90%',
  },
  chart: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6b21a8',
  },
});
