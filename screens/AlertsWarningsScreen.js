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

// Map a MongoDB record → alert display item
function recordToAlertItem(record) {
  const items = [];

  if (record.drowsiness?.is_drowsy) {
    items.push({
      icon: "😴",
      bg: "#FEE2E2",
      title: "Drowsiness Detected",
      detail: `Eyes closed ${record.drowsiness.time_closed_s}s`,
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      level: "Critical",
      levelBg: "#FEE2E2",
      levelColor: "#DC2626",
    });
  }

  const behaviour = record.behaviour?.detected ?? "";
  if (behaviour === "Aggressive Driving") {
    items.push({
      icon: "⚠️",
      bg: "#FEF3C7",
      title: "Aggressive Driving",
      detail: `${record.behaviour.confidence?.toFixed(1)}% confidence`,
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      level: "High",
      levelBg: "#FEF3C7",
      levelColor: "#F59E0B",
    });
  } else if (behaviour === "Sudden Braking") {
    items.push({
      icon: "🛑",
      bg: "#FEE2E2",
      title: "Sudden Braking",
      detail: `${record.behaviour.confidence?.toFixed(1)}% confidence`,
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      level: "Medium",
      levelBg: "#FEF3C7",
      levelColor: "#F59E0B",
    });
  } else if (behaviour === "Sharp Turn") {
    items.push({
      icon: "🔄",
      bg: "#DBEAFE",
      title: "Sharp Turn",
      detail: `${record.behaviour.confidence?.toFixed(1)}% confidence`,
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      level: "Low",
      levelBg: "#DBEAFE",
      levelColor: "#2563EB",
    });
  }

  return items;
}

function AlertItem({ item }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
      <View style={{
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: item.bg,
        justifyContent: "center", alignItems: "center", marginRight: 14,
      }}>
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}>{item.title}</Text>
        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>{item.detail}</Text>
        <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{item.time}</Text>
      </View>
      <View style={{ backgroundColor: item.levelBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: item.levelColor }}>{item.level}</Text>
      </View>
    </View>
  );
}

export default function AlertsWarningsScreen({ navigation }) {
  const [records, setRecords]       = useState([]);
  const [summary, setSummary]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [recentRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/api/status/recent?limit=100`),
        axios.get(`${API_BASE}/api/stats/summary`),
      ]);
      setRecords(recentRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError("Could not load alerts. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Split records into today vs earlier
  const now       = new Date();
  const todayStr  = now.toDateString();
  const yesterdayStr = new Date(now - 86400000).toDateString();

  const todayAlerts    = [];
  const yesterdayAlerts = [];

  records.forEach((rec) => {
    const recDate = new Date(rec.timestamp).toDateString();
    const items   = recordToAlertItem(rec);
    if (recDate === todayStr)     todayAlerts.push(...items);
    else if (recDate === yesterdayStr) yesterdayAlerts.push(...items);
  });

  const totalAlerts = todayAlerts.length;
  const drowsyCount = summary?.drowsiness?.total_drowsy_events ?? 0;
  const dangerCount = (summary?.behaviour?.aggressive_driving ?? 0)
                    + (summary?.behaviour?.sudden_braking ?? 0)
                    + (summary?.behaviour?.sharp_turns ?? 0);
  const totalDanger = drowsyCount + dangerCount;
  const totalRecords = summary?.total_records ?? 1;
  const safetyScore  = Math.max(0, Math.round(100 - (totalDanger / totalRecords) * 100));

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
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>Alerts & Warnings</Text>
      </View>

      {/* Error */}
      {error && (
        <View style={{ backgroundColor: "#FEE2E2", borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "600" }}>⚠️ {error}</Text>
        </View>
      )}

      <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 16 }}>
        Safety Summary
      </Text>

      {/* Summary Cards */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 28 }}>
        <View style={{ width: "48%", backgroundColor: "#FACC15", borderRadius: 18, padding: 18 }}>
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={{ fontSize: 28, fontWeight: "800", color: "#000000" }}>{totalAlerts}</Text>
          }
          <Text style={{ marginTop: 6, fontSize: 14, fontWeight: "600", color: "#1F2937" }}>Alerts Today</Text>
        </View>

        <View style={{ width: "48%", backgroundColor: "#22C55E", borderRadius: 18, padding: 18 }}>
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={{ fontSize: 28, fontWeight: "800", color: "#000000" }}>{safetyScore}</Text>
          }
          <Text style={{ marginTop: 6, fontSize: 14, fontWeight: "600", color: "#065F46" }}>Safety Score</Text>
        </View>
      </View>

      {/* Today */}
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 }}>Today</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
      ) : todayAlerts.length === 0 ? (
        <View style={{ backgroundColor: "#DCFCE7", borderRadius: 12, padding: 16, marginBottom: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 6 }}>✅</Text>
          <Text style={{ color: "#166534", fontWeight: "600", fontSize: 14 }}>No alerts today!</Text>
          <Text style={{ color: "#15803D", fontSize: 12, marginTop: 4 }}>Keep up the safe driving.</Text>
        </View>
      ) : (
        todayAlerts.map((item, index) => <AlertItem key={index} item={item} />)
      )}

      {/* Yesterday */}
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginVertical: 12 }}>Yesterday</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
      ) : yesterdayAlerts.length === 0 ? (
        <View style={{ backgroundColor: "#F3F4F6", borderRadius: 12, padding: 16, marginBottom: 40, alignItems: "center" }}>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>No alerts yesterday</Text>
        </View>
      ) : (
        yesterdayAlerts.map((item, index) => <AlertItem key={index} item={item} />)
      )}

      {/* Overall Stats */}
      {summary && (
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 60, elevation: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 14 }}>All-Time Stats</Text>
          {[
            { label: "Total Drowsy Events",   value: summary.drowsiness?.total_drowsy_events ?? 0,  color: "#EF4444" },
            { label: "Aggressive Driving",    value: summary.behaviour?.aggressive_driving   ?? 0,  color: "#F59E0B" },
            { label: "Sudden Braking",        value: summary.behaviour?.sudden_braking       ?? 0,  color: "#F59E0B" },
            { label: "Sharp Turns",           value: summary.behaviour?.sharp_turns          ?? 0,  color: "#2563EB" },
            { label: "Normal Driving Events", value: summary.behaviour?.normal_driving       ?? 0,  color: "#10B981" },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={{ color: "#6B7280", fontSize: 13 }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: row.color }}>{row.value}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}