import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";

const API_BASE = "http://10.255.53.128:8000";
const { width } = Dimensions.get("window");

// ── Helpers ───────────────────────────────────
function fmt(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = today.toISOString().slice(0, 10);
  const yestStr  = yesterday.toISOString().slice(0, 10);
  if (dateStr === todayStr)   return "Today";
  if (dateStr === yestStr)    return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function getLast14Days() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getBehaviourIcon(b) {
  if (!b) return "🚗";
  if (b.includes("Aggressive")) return "⚠️";
  if (b.includes("Braking"))    return "🛑";
  if (b.includes("Turn"))       return "🔄";
  return "✅";
}

function getBehaviourColor(b) {
  if (!b) return "#10B981";
  if (b.includes("Aggressive")) return "#F59E0B";
  if (b.includes("Braking"))    return "#EF4444";
  if (b.includes("Turn"))       return "#3B82F6";
  return "#10B981";
}

function calcSafetyScore(records) {
  if (!records || records.length === 0) return 100;
  const danger = records.filter(r => {
    const b = r?.behaviour?.detected ?? "";
    return r?.drowsiness?.is_drowsy || b.includes("Aggressive") || b.includes("Braking") || b.includes("Turn");
  }).length;
  return Math.max(0, Math.round(100 - (danger / records.length) * 100));
}

// ── Day Card (horizontal strip) ──────────────
function DayCard({ dateStr, isSelected, onPress }) {
  const label = fmtDate(dateStr);
  return (
    <TouchableOpacity
      style={[styles.dayCard, isSelected && styles.dayCardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
        {label === "Today" || label === "Yesterday" ? label : dateStr.slice(5)}
      </Text>
    </TouchableOpacity>
  );
}

// ── Record Row ────────────────────────────────
function RecordRow({ item }) {
  const b      = item?.behaviour?.detected ?? "—";
  const isDrow = item?.drowsiness?.is_drowsy ?? false;
  const icon   = isDrow ? "😴" : getBehaviourIcon(b);
  const color  = isDrow ? "#EF4444" : getBehaviourColor(b);
  const conf   = item?.behaviour?.confidence ?? 0;
  const time   = fmt(item?.timestamp);
  const ax     = (item?.sensor?.accel_x ?? 0).toFixed(2);
  const ay     = (item?.sensor?.accel_y ?? 0).toFixed(2);
  const az     = (item?.sensor?.accel_z ?? 0).toFixed(2);

  return (
    <View style={styles.recordRow}>
      <View style={[styles.recordIconBox, { backgroundColor: color + "18" }]}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.recordTop}>
          <Text style={[styles.recordBehav, { color }]}>{isDrow ? "Drowsiness" : b}</Text>
          <Text style={styles.recordTime}>{time}</Text>
        </View>
        <Text style={styles.recordSensor}>
          ax:{ax}  ay:{ay}  az:{az}  ·  {conf.toFixed(0)}% conf
        </Text>
        {isDrow && (
          <View style={styles.drowsyTag}>
            <Text style={styles.drowsyTagText}>😴 Eyes closed {(item?.drowsiness?.time_closed_s ?? 0).toFixed(1)}s</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Stats Bar ─────────────────────────────────
function StatsBar({ records }) {
  const total  = records.length;
  const drowsy = records.filter(r => r?.drowsiness?.is_drowsy).length;
  const aggr   = records.filter(r => (r?.behaviour?.detected ?? "").includes("Aggressive")).length;
  const brake  = records.filter(r => (r?.behaviour?.detected ?? "").includes("Braking")).length;
  const turn   = records.filter(r => (r?.behaviour?.detected ?? "").includes("Turn")).length;
  const normal = records.filter(r => {
    const b = r?.behaviour?.detected ?? "";
    return !r?.drowsiness?.is_drowsy && b === "Normal Driving";
  }).length;
  const score  = calcSafetyScore(records);
  const scoreColor = score >= 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <View style={styles.statsCard}>
      {/* Score ring */}
      <View style={styles.statsTop}>
        <View style={[styles.miniRing, { borderColor: scoreColor }]}>
          <Text style={[styles.miniRingNum, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.miniRingSub}>/100</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.statsTitle}>Day Summary</Text>
          <Text style={styles.statsTotal}>{total} records</Text>
        </View>
      </View>

      {/* Row of badges */}
      <View style={styles.badgeRow}>
        <StatBadge label="Normal"    count={normal} color="#10B981" />
        <StatBadge label="Drowsy"    count={drowsy} color="#EF4444" />
        <StatBadge label="Aggressive" count={aggr}  color="#F59E0B" />
        <StatBadge label="Braking"   count={brake}  color="#EF4444" />
        <StatBadge label="Turns"     count={turn}   color="#3B82F6" />
      </View>
    </View>
  );
}

function StatBadge({ label, count, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + "18" }]}>
      <Text style={[styles.badgeCount, { color }]}>{count}</Text>
      <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ══════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════
export default function HistoryScreen({ navigation }) {
  const days = getLast14Days();

  const [selectedDay, setSelectedDay]   = useState(null);
  const [dayRecords,  setDayRecords]    = useState([]);
  const [loading,     setLoading]       = useState(false);
  const [refreshing,  setRefreshing]    = useState(false);
  const [initLoading, setInitLoading]   = useState(true);
  const [error,       setError]         = useState(null);
  const [hasDataDays, setHasDataDays]   = useState({});

  // On mount: find which days have data, auto-select most recent
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/history/range?days=14`);
        const data = await res.json();
        const map  = {};
        if (Array.isArray(data)) {
          data.forEach(d => { if (d.date) map[d.date] = d.total_records > 0; });
        }
        setHasDataDays(map);

        // Auto-select first day with data
        const firstDay = days.find(d => map[d]) ?? days[0];
        setSelectedDay(firstDay);
      } catch (e) {
        console.log("Range fetch error:", e);
        setSelectedDay(days[0]);
      } finally {
        setInitLoading(false);
      }
    })();
  }, []);

  // Fetch records when selected day changes
  useEffect(() => {
    if (!selectedDay) return;
    fetchDayRecords(selectedDay);
  }, [selectedDay]);

  const fetchDayRecords = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/history/day?date=${date}&limit=500`;
      console.log("Fetching:", url);
      const res  = await fetch(url);
      const data = await res.json();
      console.log("Got records:", Array.isArray(data) ? data.length : data);
      setDayRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Day fetch error:", e);
      setError("Could not load records. Check connection.");
      setDayRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedDay) fetchDayRecords(selectedDay);
  };

  if (initLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerSub}>SESSION</Text>
          <Text style={styles.headerTitle}>Drive History</Text>
        </View>
      </View>

      {/* Day Selector Strip */}
      <View style={{ marginBottom: 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayStrip}
        >
          {days.map(d => (
            <DayCard
              key={d}
              dateStr={d}
              isSelected={selectedDay === d}
              onPress={() => setSelectedDay(d)}
              hasData={!!hasDataDays[d]}
            />
          ))}
        </ScrollView>
      </View>

      {/* Records List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading {fmtDate(selectedDay)}...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchDayRecords(selectedDay)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : dayRecords.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🛣️</Text>
          <Text style={styles.emptyTitle}>No records for {fmtDate(selectedDay)}</Text>
          <Text style={styles.emptySubtitle}>Try selecting another day above</Text>
        </View>
      ) : (
        <FlatList
          data={dayRecords}
          keyExtractor={(item, i) => item._id ?? String(i)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
          ListHeaderComponent={<StatsBar records={dayRecords} />}
          renderItem={({ item }) => <RecordRow item={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#F1F5F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#0F172A",
  },
  backBtn:    { padding: 8, backgroundColor: "#1E293B", borderRadius: 12 },
  backArrow:  { fontSize: 20, color: "#CBD5E1", fontWeight: "700" },
  headerSub:  { fontSize: 11, color: "#475569", fontWeight: "700", letterSpacing: 2 },
  headerTitle:{ fontSize: 26, fontWeight: "900", color: "#F8FAFC", marginTop: 2 },

  dayStrip:   { paddingHorizontal: 16, paddingVertical: 14, gap: 8, flexDirection: "row" },
  dayCard:    {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    marginRight: 8,
  },
  dayCardSelected: { backgroundColor: "#6366F1" },
  dayLabel:        { fontSize: 12, fontWeight: "700", color: "#64748B" },
  dayLabelSelected:{ color: "#fff" },

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
    elevation: 2,
  },
  statsTop:   { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  statsTitle: { fontSize: 11, color: "#94A3B8", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  statsTotal: { fontSize: 20, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  miniRing: {
    width: 68, height: 68, borderRadius: 34, borderWidth: 7,
    justifyContent: "center", alignItems: "center",
  },
  miniRingNum: { fontSize: 20, fontWeight: "900" },
  miniRingSub: { fontSize: 9, color: "#94A3B8" },

  badgeRow:  { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  badge:     { flex: 1, borderRadius: 12, paddingVertical: 8, alignItems: "center" },
  badgeCount:{ fontSize: 16, fontWeight: "900" },
  badgeLabel:{ fontSize: 9, fontWeight: "700", marginTop: 2 },

  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    elevation: 1,
  },
  recordIconBox: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
  },
  recordTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recordBehav: { fontSize: 14, fontWeight: "800" },
  recordTime:  { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  recordSensor:{ fontSize: 11, color: "#94A3B8", marginTop: 3 },
  drowsyTag:   {
    marginTop: 5,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  drowsyTagText: { fontSize: 10, color: "#DC2626", fontWeight: "700" },

  loadingText:  { marginTop: 10, color: "#64748B", fontSize: 14 },
  errorText:    { fontSize: 14, color: "#EF4444", textAlign: "center", marginBottom: 16 },
  retryBtn:     { backgroundColor: "#6366F1", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  retryText:    { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyTitle:   { fontSize: 16, fontWeight: "800", color: "#334155", textAlign: "center" },
  emptySubtitle:{ fontSize: 13, color: "#94A3B8", marginTop: 6, textAlign: "center" },
});