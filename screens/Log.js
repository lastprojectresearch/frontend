import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

/* ---------------- SPEED METER ---------------- */
const SpeedMeter = ({ speed }) => {
  return (
    <View style={styles.meterWrapper}>
      <View style={styles.meterCircle}>
        <View style={styles.meterInner}>
          <Text style={styles.meterValue}>{speed}</Text>
          <Text style={styles.meterUnit}>km/h</Text>
        </View>
      </View>
      <Text style={styles.meterLabel}>Current Speed</Text>
    </View>
  );
};

const formatTime = (hour) =>
  `${hour.toString().padStart(2, '0')}:00`;

/* ---------------- MAIN SCREEN ---------------- */
export default function LogScreen() {
  const [timeLabels, setTimeLabels] = useState([]);
  const [speedData, setSpeedData] = useState([]);
  const [chartReady, setChartReady] = useState(false);

  const [blindSpotDanger] = useState(4);
  const [blindBendDanger] = useState(2);
  const [trafficSignCount] = useState(11);

  const [currentSpeed, setCurrentSpeed] = useState(0);

  useEffect(() => {
    const hours = [];
    for (let h = 0; h <= 21; h += 3) hours.push(h);

    setTimeLabels(hours.map(formatTime));
    setSpeedData(hours.map(() => Math.floor(Math.random() * 200)));
    setChartReady(true);

    const interval = setInterval(() => {
      setCurrentSpeed(Math.floor(Math.random() * 120));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartWidth = Math.max(
    Dimensions.get('window').width - 40,
    320
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* SPEED METER */}
      <Text style={styles.sectionTitle}>Speed Meter</Text>
      <SpeedMeter speed={currentSpeed} />

      {/* SUMMARY */}
      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Average Speed</Text>
        <Text style={styles.cardValue}>86 km/h</Text>
      </View>

      {/* SPEED GRAPH */}
      <Text style={styles.sectionTitle}>Speed Graph</Text>
      <View style={styles.chartContainer}>
        {chartReady && (
          <LineChart
            data={{
              labels: timeLabels,
              datasets: [{ data: speedData }],
            }}
            width={chartWidth}
            height={220}
            fromZero
            bezier
            chartConfig={{
              backgroundColor: '#1E293B',
              backgroundGradientFrom: '#1E293B',
              backgroundGradientTo: '#0F172A',
              decimalPlaces: 0,
              color: (o = 1) =>
                `rgba(34,197,94,${o})`,
              labelColor: () => '#F8FAFC',
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#22C55E',
              },
            }}
            style={styles.chart}
          />
        )}
      </View>

      {/* DANGER COUNTS */}
      <Text style={styles.sectionTitle}>Danger Counts</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Blind Spot Danger</Text>
        <Text style={styles.warningValue}>{blindSpotDanger}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Blind Bend Danger</Text>
        <Text style={styles.warningValue}>{blindBendDanger}</Text>
      </View>

      {/* TRAFFIC SIGNS */}
      <Text style={styles.sectionTitle}>Traffic Sign Count</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Traffic Sign Detections
        </Text>
        <Text style={styles.successValue}>
          {trafficSignCount}
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingTop: 30,
    paddingBottom: 80,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 28,
    marginBottom: 16,
  },

  /* SPEED METER */
  meterWrapper: { alignItems: 'center' },
  meterCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#22C55E',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterInner: {
    width: 145,
    height: 145,
    borderRadius: 72,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterValue: {
    fontSize: 50,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  meterUnit: {
    fontSize: 16,
    color: '#CBD5E1',
  },
  meterLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#020617',
  },

  /* CARDS */
  card: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 18,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#22C55E',
    marginTop: 4,
  },

  successValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#22C55E',
  },
  warningValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EF4444',
  },

  /* CHART */
  chartContainer: {
    width: '90%',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});
