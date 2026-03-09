import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, ActivityIndicator, StyleSheet,
  ScrollView, RefreshControl, Modal, Animated,
  Vibration, Dimensions,TouchableOpacity,
} from "react-native";

const API = "http://10.255.53.128:8000/api/status/latest";
const API_STATS = "http://10.255.53.128:8000/api/stats/summary";
const { width } = Dimensions.get("window");

const DANGER = ["Aggressive Driving", "Sudden Braking", "Sharp Turn"];

const ALERT_CONFIG = {
  drowsy: {
    icon: "😴", title: "Drowsiness Detected!",
    message: "Your eyes have been closed too long.\nPlease pull over and rest.",
    color: "#EF4444",
  },
  "Aggressive Driving": {
    icon: "⚠️", title: "Aggressive Driving!",
    message: "Harsh manoeuvres detected.\nSlow down and drive calmly.",
    color: "#F59E0B",
  },
  "Sudden Braking": {
    icon: "🛑", title: "Sudden Braking!",
    message: "Sudden braking detected.\nMaintain safe following distance.",
    color: "#F59E0B",
  },
  "Sharp Turn": {
    icon: "🔄", title: "Sharp Turn Detected!",
    message: "A sharp turn was detected.\nReduce speed when cornering.",
    color: "#3B82F6",
  },
};

// ── Alert Modal ───────────────────────────────
function AlertModal({ visible, config, onDismiss }) {
  const scale   = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, useNativeDriver: true, tension: 80, friction: 7 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.8);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!config) return null;
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onDismiss}>
      <View style={s.modalBg}>
        <Animated.View style={[s.modalCard, { transform: [{ scale }], opacity }]}>
          <View style={[s.modalTop, { backgroundColor: config.color + "22" }]}>
            <Text style={{ fontSize: 52 }}>{config.icon}</Text>
          </View>
          <View style={s.modalBody}>
            <Text style={[s.modalTitle, { color: config.color }]}>{config.title}</Text>
            <Text style={s.modalMsg}>{config.message}</Text>
            <View style={[s.modalBtn, { backgroundColor: config.color }]}>
              <Text style={s.modalBtnText} onPress={onDismiss}>Got It</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Stat Row ──────────────────────────────────
function StatRow({ label, value, color = "#334155" }) {
  return (
    <View style={s.statRow}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color }]}>{value}</Text>
    </View>
  );
}

// ── Sensor Pill ───────────────────────────────
function Pill({ label, value, unit, color }) {
  return (
    <View style={s.pill}>
      <Text style={[s.pillVal, { color }]}>{value}<Text style={s.pillUnit}>{unit}</Text></Text>
      <Text style={s.pillLabel}>{label}</Text>
    </View>
  );
}

// ══════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════
export default function Homedriver({navigation }) {
  const [driverData, setDriverData] = useState(null);
  const [statsData,  setStatsData]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig,  setAlertConfig]  = useState(null);

  const alertCooldown = useRef({});
  const pulseAnim     = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const triggerAlert = (key, cfg) => {
    const now = Date.now();
    if ((alertCooldown.current[key] ?? 0) + 15000 > now) return;
    alertCooldown.current[key] = now;
    setAlertConfig(cfg);
    setAlertVisible(true);
    Vibration.vibrate([0, 300, 150, 300]);
  };

  // ── Fetch — same pattern as your working code ──
  const fetchDriverData = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      console.log("Driver Data:", data);
      setDriverData(data);

      const statsRes = await fetch(API_STATS);
      const stats    = await statsRes.json();
      setStatsData(stats);

      // Trigger alerts
      const isDrowsy  = data?.drowsiness?.is_drowsy ?? false;
      const behaviour = data?.behaviour?.detected   ?? "";
      if (isDrowsy)              triggerAlert("drowsy",    ALERT_CONFIG.drowsy);
      else if (DANGER.includes(behaviour)) triggerAlert(behaviour, ALERT_CONFIG[behaviour]);

    } catch (error) {
      console.log("API ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(fetchDriverData, 1000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchDriverData(); };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ marginTop: 10, color: "#64748B" }}>Connecting...</Text>
      </View>
    );
  }

  // ── Derived values ────────────────────────
  const isDrowsy   = driverData?.drowsiness?.is_drowsy ?? false;
  const behaviour  = driverData?.behaviour?.detected   ?? "—";
  const confidence = driverData?.behaviour?.confidence ?? 0;
  const isDanger   = isDrowsy || DANGER.includes(behaviour);

  const totalRecords = statsData?.total_records ?? 0;
  const drowsyCount  = statsData?.drowsiness?.total_drowsy_events    ?? 0;
  const aggrCount    = statsData?.behaviour?.aggressive_driving       ?? 0;
  const brakCount    = statsData?.behaviour?.sudden_braking           ?? 0;
  const turnCount    = statsData?.behaviour?.sharp_turns              ?? 0;
  const normalCount  = statsData?.behaviour?.normal_driving           ?? 0;
  const dangerTotal  = drowsyCount + aggrCount + brakCount + turnCount;
  const safetyScore  = totalRecords > 0
    ? Math.max(0, Math.round(100 - (dangerTotal / totalRecords) * 100))
    : 100;

  const scoreColor  = safetyScore >= 70 ? "#10B981" : safetyScore >= 40 ? "#F59E0B" : "#EF4444";
  const statusColor = isDrowsy ? "#EF4444" : isDanger ? "#F59E0B" : "#10B981";
  const statusText  = isDrowsy ? "DROWSY" : isDanger ? behaviour.toUpperCase() : "SAFE DRIVING";
  const statusIcon  = isDrowsy ? "😴" : isDanger ? "⚠️" : "✅";
  const lastUpdate  = driverData?.timestamp
    ? new Date(driverData.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  return (
    <>
      <AlertModal visible={alertVisible} config={alertConfig} onDismiss={() => setAlertVisible(false)} />

      <ScrollView
        style={s.root}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerSub}>REAL-TIME</Text>
            <Text style={s.headerTitle}>Driver Monitor</Text>
          </View>
          <View style={s.liveChip}>
            <Animated.View style={[s.liveDot, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={s.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Status Banner */}
        <View style={[s.banner, { backgroundColor: statusColor }]}>
          <Text style={{ fontSize: 40 }}>{statusIcon}</Text>
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={s.bannerSub}>Current State</Text>
            <Text style={s.bannerText}>{statusText}</Text>
            <Text style={s.bannerTime}>Updated: {lastUpdate}</Text>
          </View>
          <View style={s.confBox}>
            <Text style={s.confNum}>{confidence.toFixed(0)}%</Text>
            <Text style={s.confLabel}>conf.</Text>
          </View>
        </View>

        {/* Score + Drowsiness row */}
        <View style={s.row}>
          <View style={[s.card, { flex: 1, marginRight: 8, alignItems: "center" }]}>
            <Text style={s.cardTitle}>Safety Score</Text>
            <View style={[s.ring, { borderColor: scoreColor }]}>
              <Text style={[s.ringNum, { color: scoreColor }]}>{safetyScore}</Text>
              <Text style={s.ringMax}>/100</Text>
            </View>
            <Text style={[s.scoreTag, { color: scoreColor }]}>
              {safetyScore >= 70 ? "Excellent" : safetyScore >= 40 ? "Fair" : "Poor"}
            </Text>
          </View>

          <View style={[s.card, { flex: 1, marginLeft: 8, alignItems: "center" }]}>
            <Text style={s.cardTitle}>Drowsiness</Text>
            <Text style={{ fontSize: 44, marginVertical: 6 }}>{isDrowsy ? "😴" : "👁️"}</Text>
            <View style={[s.badge, { backgroundColor: isDrowsy ? "#FEE2E2" : "#D1FAE5" }]}>
              <Text style={[s.badgeText, { color: isDrowsy ? "#DC2626" : "#065F46" }]}>
                {driverData?.drowsiness?.status ?? (isDrowsy ? "DROWSY" : "ALERT")}
              </Text>
            </View>
            <View style={s.eyeRow}>
              <Text style={{ color: driverData?.drowsiness?.left_eye_open  ? "#10B981" : "#EF4444", fontSize: 12 }}>● L</Text>
              <Text style={{ color: driverData?.drowsiness?.right_eye_open ? "#10B981" : "#EF4444", fontSize: 12, marginLeft: 10 }}>● R</Text>
            </View>
          </View>
        </View>

        {/* Behaviour */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={s.cardTitle}>Driving Behaviour</Text>
            <View style={[s.badge, { backgroundColor: isDanger ? "#FEF3C7" : "#D1FAE5" }]}>
              <Text style={[s.badgeText, { color: isDanger ? "#92400E" : "#065F46" }]}>
                {isDanger ? "⚠️ Alert" : "✅ Normal"}
              </Text>
            </View>
          </View>
          <Text style={[s.behaviourText, { color: isDanger ? "#EF4444" : "#10B981" }]}>{behaviour}</Text>

          {driverData?.behaviour?.probabilities &&
            Object.entries(driverData.behaviour.probabilities).map(([label, pct]) => (
              <View key={label} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                  <Text style={{ fontSize: 12, color: "#64748B" }}>{label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#334155" }}>{pct.toFixed(1)}%</Text>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill, {
                    width: `${pct}%`,
                    backgroundColor: label === behaviour ? "#6366F1" : "#CBD5E1",
                  }]} />
                </View>
              </View>
            ))
          }
        </View>

        {/* Sensor */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Live Sensor</Text>
          <View style={s.pillRow}>
            <Pill label="Accel X" value={(driverData?.sensor?.accel_x ?? 0).toFixed(2)} unit=" g"   color="#6366F1" />
            <Pill label="Accel Y" value={(driverData?.sensor?.accel_y ?? 0).toFixed(2)} unit=" g"   color="#6366F1" />
            <Pill label="Accel Z" value={(driverData?.sensor?.accel_z ?? 0).toFixed(2)} unit=" g"   color="#6366F1" />
          </View>
          <View style={s.pillRow}>
            <Pill label="Gyro X"  value={(driverData?.sensor?.gyro_x  ?? 0).toFixed(1)} unit="°/s" color="#8B5CF6" />
            <Pill label="Gyro Y"  value={(driverData?.sensor?.gyro_y  ?? 0).toFixed(1)} unit="°/s" color="#8B5CF6" />
            <Pill label="Gyro Z"  value={(driverData?.sensor?.gyro_z  ?? 0).toFixed(1)} unit="°/s" color="#8B5CF6" />
          </View>
        </View>

        {/* Session Stats */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Session Summary</Text>
          <StatRow label="Total Records"  value={totalRecords} />
          <StatRow label="Normal Driving" value={normalCount}  color="#10B981" />
          <StatRow label="Drowsy Events"  value={drowsyCount}  color={drowsyCount > 0 ? "#EF4444" : "#10B981"} />
          <StatRow label="Aggressive"     value={aggrCount}    color={aggrCount   > 0 ? "#F59E0B" : "#10B981"} />
          <StatRow label="Sudden Braking" value={brakCount}    color={brakCount   > 0 ? "#F59E0B" : "#10B981"} />
          <StatRow label="Sharp Turns"    value={turnCount}    color={turnCount   > 0 ? "#3B82F6" : "#10B981"} />
        </View>

        <Text style={s.footer}>Auto-refresh: 1s  ·  {lastUpdate}</Text>
        {/* History Button */}
<TouchableOpacity
  style={{
    backgroundColor: "#0F172A",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  }}
  onPress={() => navigation.navigate("HistoryScreen")}
  activeOpacity={0.8}
>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ fontSize: 28, marginRight: 14 }}>🛣️</Text>
    <View>
      <Text style={{ fontSize: 11, color: "#475569", fontWeight: "700", letterSpacing: 1 }}>PAST SESSIONS</Text>
      <Text style={{ fontSize: 18, fontWeight: "900", color: "#F8FAFC", marginTop: 2 }}>Driving History</Text>
    </View>
  </View>
  <Text style={{ fontSize: 22, color: "#6366F1" }}>→</Text>
</TouchableOpacity>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: "#F1F5F9" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F1F5F9" },

  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16 },
  headerSub:   { fontSize: 11, color: "#94A3B8", fontWeight: "700", letterSpacing: 2 },
  headerTitle: { fontSize: 26, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  liveChip:    { flexDirection: "row", alignItems: "center", backgroundColor: "#DCFCE7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: "#10B981", marginRight: 6 },
  liveText:    { fontSize: 11, fontWeight: "800", color: "#065F46", letterSpacing: 1 },

  banner:      { marginHorizontal: 20, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", marginBottom: 14, elevation: 4 },
  bannerSub:   { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  bannerText:  { fontSize: 20, fontWeight: "900", color: "#fff", letterSpacing: 0.5, marginVertical: 2 },
  bannerTime:  { fontSize: 10, color: "rgba(255,255,255,0.65)" },
  confBox:     { alignItems: "center" },
  confNum:     { fontSize: 28, fontWeight: "900", color: "#fff" },
  confLabel:   { fontSize: 10, color: "rgba(255,255,255,0.7)" },

  row:         { flexDirection: "row", marginHorizontal: 20, marginBottom: 14 },
  card:        { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginHorizontal: 20, marginBottom: 14, elevation: 2 },
  cardTitle:   { fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },

  ring:        { width: 100, height: 100, borderRadius: 50, borderWidth: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  ringNum:     { fontSize: 26, fontWeight: "900" },
  ringMax:     { fontSize: 10, color: "#94A3B8" },
  scoreTag:    { fontSize: 12, fontWeight: "700" },

  badge:       { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  badgeText:   { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  eyeRow:      { flexDirection: "row", marginTop: 8 },

  behaviourText: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 10 },
  barBg:       { height: 6, backgroundColor: "#F1F5F9", borderRadius: 3, overflow: "hidden" },
  barFill:     { height: 6, borderRadius: 3 },

  pillRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  pill:        { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 12, padding: 10, alignItems: "center", marginHorizontal: 3 },
  pillVal:     { fontSize: 15, fontWeight: "800" },
  pillUnit:    { fontSize: 9, fontWeight: "500", color: "#94A3B8" },
  pillLabel:   { fontSize: 10, color: "#94A3B8", marginTop: 2 },

  statRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  statLabel:   { fontSize: 14, color: "#64748B" },
  statValue:   { fontSize: 14, fontWeight: "700" },

  footer:      { textAlign: "center", color: "#94A3B8", fontSize: 11, marginTop: 4 },

  modalBg:     { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  modalCard:   { width: "100%", backgroundColor: "#fff", borderRadius: 24, overflow: "hidden", elevation: 10 },
  modalTop:    { alignItems: "center", paddingVertical: 28 },
  modalBody:   { padding: 24, alignItems: "center" },
  modalTitle:  { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  modalMsg:    { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 22, marginBottom: 24 },
  modalBtn:    { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, width: "100%", alignItems: "center" },
  modalBtnText:{ color: "#fff", fontSize: 16, fontWeight: "800" },
});