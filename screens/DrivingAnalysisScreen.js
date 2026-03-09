import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";

const API_BASE = "http://192.168.52.1:8000";

function StatRow({ label, value, color = "#111827", unit = "" }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <Text style={{ color: "#6B7280", fontSize: 13 }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "700", color }}>{value}{unit}</Text>
    </View>
  );
}

function BehaviourBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: "#374151", fontSize: 13, fontWeight: "600" }}>{label}</Text>
        <Text style={{ color: "#6B7280", fontSize: 13 }}>{value} ({pct}%)</Text>
      </View>
      <View style={{ height: 8, backgroundColor: "#F3F4F6", borderRadius: 4 }}>
        <View style={{ height: 8, width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
    </View>
  );
}

export default function DrivingAnalysisScreen({ navigation }) {
  const [summary, setSummary]         = useState(null);
  const [recent, setRecent]           = useState([]);
  const [latestData, setLatestData]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [summaryRes, recentRes, latestRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stats/summary`),
        axios.get(`${API_BASE}/api/status/recent?limit=20`),
        axios.get(`${API_BASE}/api/status/latest`),
      ]);
      setSummary(summaryRes.data);
      setRecent(recentRes.data);
      setLatestData(latestRes.data);
    } catch (err) {
      setError("Could not load analysis data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalRecords  = summary?.total_records ?? 0;
  const normalCount   = summary?.behaviour?.normal_driving    ?? 0;
  const aggressiveCount = summary?.behaviour?.aggressive_driving ?? 0;
  const brakingCount  = summary?.behaviour?.sudden_braking    ?? 0;
  const turnCount     = summary?.behaviour?.sharp_turns       ?? 0;
  const drowsyCount   = summary?.drowsiness?.total_drowsy_events ?? 0;
  const drowsyPct     = summary?.drowsiness?.drowsy_percentage ?? 0;

  const dangerTotal   = aggressiveCount + brakingCount + turnCount + drowsyCount;
  const safetyScore   = totalRecords > 0
    ? Math.max(0, Math.round(100 - (dangerTotal / totalRecords) * 100))
    : 100;

  const scoreColor = safetyScore >= 70 ? "#10B981" : safetyScore >= 40 ? "#F59E0B" : "#EF4444";

  const firstRecord = summary?.session?.first_record
    ? new Date(summary.session.first_record).toLocaleDateString()
    : "—";
  const lastRecord  = summary?.session?.last_record
    ? new Date(summary.session.last_record).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 20, paddingTop: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, marginRight: 12 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>Driving Analysis</Text>
      </View>

      {/* Error */}
      {error && (
        <View style={{ backgroundColor: "#FEE2E2", borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "600" }}>⚠️ {error}</Text>
        </View>
      )}

      {/* Safety Score Card */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, marginBottom: 20, elevation: 3 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#6B7280", marginBottom: 16 }}>Overall Safety Score</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ alignItems: "center" }}>
            <View style={{
              width: 140, height: 140, borderRadius: 70,
              borderWidth: 14, borderColor: "#E5E7EB",
              borderTopColor: scoreColor, borderRightColor: scoreColor,
              justifyContent: "center", alignItems: "center",
              transform: [{ rotate: "-45deg" }],
            }}>
              <Text style={{ fontSize: 42, fontWeight: "700", color: "#111827", transform: [{ rotate: "45deg" }] }}>
                {safetyScore}
              </Text>
            </View>
            <Text style={{ marginTop: 16, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
              Based on {totalRecords} monitoring records
            </Text>
          </View>
        )}
      </View>

      {/* Live Status */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 14 }}>
          Live Status
        </Text>
        {loading || !latestData ? (
          <ActivityIndicator color="#6B7280" />
        ) : (
          <>
            <StatRow
              label="Current Behaviour"
              value={latestData.behaviour?.detected ?? "—"}
              color={["Aggressive Driving","Sudden Braking","Sharp Turn"].includes(latestData.behaviour?.detected) ? "#EF4444" : "#10B981"}
            />
            <StatRow
              label="Behaviour Confidence"
              value={latestData.behaviour?.confidence?.toFixed(1) ?? "—"}
              unit="%"
            />
            <StatRow
              label="Drowsiness"
              value={latestData.drowsiness?.is_drowsy ? "DROWSY" : "Awake"}
              color={latestData.drowsiness?.is_drowsy ? "#EF4444" : "#10B981"}
            />
            <StatRow
              label="Eyes Closed Duration"
              value={latestData.drowsiness?.time_closed_s?.toFixed(1) ?? "0.0"}
              unit="s"
            />
            <StatRow
              label="Left Eye"
              value={latestData.drowsiness?.left_eye_open ? "Open" : "Closed"}
              color={latestData.drowsiness?.left_eye_open ? "#10B981" : "#EF4444"}
            />
            <StatRow
              label="Right Eye"
              value={latestData.drowsiness?.right_eye_open ? "Open" : "Closed"}
              color={latestData.drowsiness?.right_eye_open ? "#10B981" : "#EF4444"}
            />
            <Text style={{ color: "#9CA3AF", fontSize: 11, textAlign: "right", marginTop: 4 }}>
              Last updated: {new Date(latestData.timestamp).toLocaleTimeString()}
            </Text>
          </>
        )}
      </View>

      {/* Behaviour Breakdown */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 16 }}>
          Behaviour Breakdown
        </Text>
        {loading ? (
          <ActivityIndicator color="#6B7280" />
        ) : (
          <>
            <BehaviourBar label="Normal Driving"    value={normalCount}     total={totalRecords} color="#10B981" />
            <BehaviourBar label="Aggressive Driving" value={aggressiveCount} total={totalRecords} color="#F59E0B" />
            <BehaviourBar label="Sudden Braking"    value={brakingCount}    total={totalRecords} color="#EF4444" />
            <BehaviourBar label="Sharp Turn"        value={turnCount}       total={totalRecords} color="#2563EB" />
          </>
        )}
      </View>

      {/* Drowsiness Stats */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 14 }}>
          Drowsiness Stats
        </Text>
        {loading ? (
          <ActivityIndicator color="#6B7280" />
        ) : (
          <>
            <StatRow label="Total Drowsy Events"   value={drowsyCount} color={drowsyCount > 0 ? "#EF4444" : "#10B981"} />
            <StatRow label="Drowsy % of Session"   value={drowsyPct.toFixed(1)} unit="%" color={drowsyPct > 10 ? "#EF4444" : "#10B981"} />
            <StatRow label="Total Monitoring Records" value={totalRecords} />
          </>
        )}
      </View>

      {/* Session Info */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 14 }}>
          Session Info
        </Text>
        {loading ? (
          <ActivityIndicator color="#6B7280" />
        ) : (
          <>
            <StatRow label="First Record"    value={firstRecord} />
            <StatRow label="Last Updated"    value={lastRecord} />
            <StatRow label="Total Readings"  value={summary?.session?.latest_total_readings ?? 0} />
          </>
        )}
      </View>

      {/* Recent Records */}
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 60, elevation: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 14 }}>
          Recent Records
        </Text>
        {loading ? (
          <ActivityIndicator color="#6B7280" />
        ) : recent.length === 0 ? (
          <Text style={{ color: "#6B7280", fontSize: 13 }}>No records yet</Text>
        ) : (
          recent.slice(0, 10).map((rec, i) => {
            const isDrowsy  = rec.drowsiness?.is_drowsy;
            const behaviour = rec.behaviour?.detected ?? "—";
            const isDanger  = ["Aggressive Driving","Sudden Braking","Sharp Turn"].includes(behaviour);
            const rowColor  = isDrowsy || isDanger ? "#FEE2E2" : "#F0FDF4";
            const textColor = isDrowsy || isDanger ? "#DC2626" : "#166534";

            return (
              <View key={i} style={{
                flexDirection: "row", justifyContent: "space-between",
                alignItems: "center", backgroundColor: rowColor,
                borderRadius: 10, padding: 12, marginBottom: 8,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: textColor }}>{behaviour}</Text>
                  {isDrowsy && (
                    <Text style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>😴 Drowsy detected</Text>
                  )}
                </View>
                <Text style={{ color: "#9CA3AF", fontSize: 11 }}>
                  {new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}