import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Speech from 'expo-speech';

const MAX_POINTS = 20;
const SPEED_MIN = 0;
const SPEED_MAX = 160;

const clampSpeed = (speed) => Math.min(Math.max(speed, SPEED_MIN), SPEED_MAX);

const SpeedMeter = ({ speed }) => (
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

export default function LogScreen() {
  const [timeLabels, setTimeLabels] = useState([]);
  const [speedData, setSpeedData] = useState([]);
  const [chartReady, setChartReady] = useState(false);
  const [blindSpotDanger, setBlindSpotDanger] = useState(0);
  const [blindBendDanger, setBlindBendDanger] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [trafficSignDangerCount, setTrafficSignDangerCount] = useState(0);
  const [lastDangerousSign, setLastDangerousSign] = useState(null);

  const backendURL = 'http://10.72.151.198:8000'; // replace with your backend IP

  const prevBlindSpotCount = useRef(0);
  const prevBlindBendCount = useRef(0);
  const prevTrafficSignCount = useRef(0);
  const lastSpokenSpeed = useRef(null);         // no repeat voice at same speed for blind spot/bend
  const lastSignKey = useRef(null);             // no repeat for same sign at same speed
  const localSignCount = useRef(0);             // local count that ignores same-speed duplicates

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${backendURL}/dashboard`);
      const data = await res.json();

      const allSpeeds = (data.speed_data || []).map(clampSpeed);
      const allLabels = data.time_labels || [];

      const slicedSpeeds = allSpeeds.slice(-MAX_POINTS);
      const slicedLabels = allLabels.slice(-MAX_POINTS);

      // X-axis: show only HH (hour) for each label — no minutes, no duplicates
      const hourLabels = slicedLabels.map((label) => {
        const d = new Date(label);
        if (!isNaN(d)) return `${String(d.getHours()).padStart(2, '0')}h`;
        return '';
      });

      setTimeLabels(hourLabels);
      setSpeedData(slicedSpeeds);
      setBlindSpotDanger(data.blind_spot_count);
      setBlindBendDanger(data.blind_bend_count);

      const newSpeed = clampSpeed(slicedSpeeds[slicedSpeeds.length - 1] || 0);
      setCurrentSpeed(newSpeed);
      setChartReady(true);

      // --- Traffic sign: only count & speak if sign+speed combo is new ---
      if (data.traffic_sign_danger_count !== undefined) {
        if (data.traffic_sign_danger_count > prevTrafficSignCount.current) {
          const sign = data.last_dangerous_sign;
          const signName = sign?.sign || 'traffic sign';
          const signKey = `${signName}_${newSpeed}`;
          // Only count + speak if this is a new sign at a new speed
          if (signKey !== lastSignKey.current) {
            localSignCount.current += 1;
            setTrafficSignDangerCount(localSignCount.current);
            Speech.speak(`Warning! ${signName.replace(/_/g, ' ')}`, { rate: 0.9 });
            lastSignKey.current = signKey;
          }
          prevTrafficSignCount.current = data.traffic_sign_danger_count;
        }
      }
      if (data.last_dangerous_sign !== undefined) {
        setLastDangerousSign(data.last_dangerous_sign);
      }

      // --- Blind spot / bend voice: only speak if speed changed ---
      if (data.blind_spot_count > prevBlindSpotCount.current && newSpeed !== lastSpokenSpeed.current) {
        Speech.speak('Warning! Dangerous Blind Spot Detected', { rate: 0.9 });
        lastSpokenSpeed.current = newSpeed;
      }
      if (data.blind_bend_count > prevBlindBendCount.current && newSpeed !== lastSpokenSpeed.current) {
        Speech.speak('Warning! Dangerous Blind Bend Ahead', { rate: 0.9 });
        lastSpokenSpeed.current = newSpeed;
      }

      prevBlindSpotCount.current = data.blind_spot_count;
      prevBlindBendCount.current = data.blind_bend_count;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartWidth = Math.max(Dimensions.get('window').width - 40, 320);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Speed Meter</Text>
      <SpeedMeter speed={currentSpeed} />

      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Average Speed</Text>
        <Text style={styles.cardValue}>
          {speedData.length > 0
            ? Math.round(speedData.reduce((a, b) => a + b, 0) / speedData.length)
            : 0}{' '}
          km/h
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Speed Graph</Text>
      <View style={styles.chartContainer}>
        {chartReady && speedData.length > 0 && (
          <LineChart
            data={{
              labels: timeLabels,
              datasets: [
                {
                  data: speedData,
                },
              ],
            }}
            width={chartWidth}
            height={220}
            fromZero
            bezier
            withShadow={false}
            chartConfig={{
              backgroundColor: '#1E293B',
              backgroundGradientFrom: '#1E293B',
              backgroundGradientTo: '#0F172A',
              decimalPlaces: 0,
              color: (o = 1) => `rgba(34,197,94,${o})`,
              labelColor: () => '#F8FAFC',
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#22C55E' },
              propsForLabels: { fontSize: 10 },
            }}
            style={styles.chart}
            segments={5}
          />
        )}
      </View>

      <Text style={styles.sectionTitle}>Danger Counts</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Blind Spot Danger</Text>
        <Text style={styles.warningValue}>{blindSpotDanger}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Blind Bend Danger</Text>
        <Text style={styles.warningValue}>{blindBendDanger}</Text>
      </View>

      <Text style={styles.sectionTitle}>Traffic Sign Danger</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Speed Limit Violations Today</Text>
        <Text style={styles.warningValue}>{trafficSignDangerCount}</Text>
      </View>

      {lastDangerousSign && (
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Last Dangerous Detection</Text>
          <View style={styles.dangerRow}>
            <Text style={styles.dangerLabel}>Sign</Text>
            <Text style={styles.dangerValue}>
              {lastDangerousSign.sign?.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.dangerRow}>
            <Text style={styles.dangerLabel}>Speed Limit</Text>
            <Text style={styles.dangerValue}>{lastDangerousSign.speed_limit} km/h</Text>
          </View>
          <View style={styles.dangerRow}>
            <Text style={styles.dangerLabel}>Your Speed</Text>
            <Text style={styles.dangerValueRed}>{lastDangerousSign.speed} km/h</Text>
          </View>
          <View style={styles.dangerRow}>
            <Text style={styles.dangerLabel}>Time</Text>
            <Text style={styles.dangerValue}>{lastDangerousSign.timestamp}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingTop: 30, paddingBottom: 80, alignItems: 'center' },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 28,
    marginBottom: 16,
  },
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
  meterValue: { fontSize: 50, fontWeight: '900', color: '#F8FAFC' },
  meterUnit: { fontSize: 16, color: '#CBD5E1' },
  meterLabel: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#020617' },
  card: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardLabel: { fontSize: 18, color: '#CBD5E1', fontWeight: '600' },
  cardValue: { fontSize: 28, fontWeight: '900', color: '#22C55E', marginTop: 4 },
  warningValue: { fontSize: 28, fontWeight: '900', color: '#EF4444' },
  chartContainer: { width: '90%', alignItems: 'center' },
  chart: { borderRadius: 16 },
  dangerCard: {
    width: '90%',
    backgroundColor: '#7F1D1D',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FEF2F2',
    marginBottom: 12,
  },
  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dangerLabel: { fontSize: 15, color: '#FECACA', fontWeight: '600' },
  dangerValue: { fontSize: 15, color: '#F8FAFC', fontWeight: '700' },
  dangerValueRed: { fontSize: 15, color: '#FCA5A5', fontWeight: '900' },
}); 