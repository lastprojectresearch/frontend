import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function AlertsWarningsScreen() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 20,
        paddingTop: 40,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 22, marginRight: 12 }}>←</Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Alerts & Warnings
        </Text>
      </View>

      {/* Summary */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#6B7280",
          marginBottom: 16,
        }}
      >
        Today’s Safety Summary
      </Text>

      {/* Summary Cards */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <View
          style={{
            width: "48%",
            backgroundColor: "#FACC15",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#000000",
            }}
          >
            3
          </Text>
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: "600",
              color: "#1F2937",
            }}
          >
            Alerts Today
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#22C55E",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#000000",
            }}
          >
            92
          </Text>
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: "600",
              color: "#065F46",
            }}
          >
            Safety Score
          </Text>
        </View>
      </View>

      {/* Today Section */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 12,
        }}
      >
        Today
      </Text>

      {[
        {
          icon: "🌙",
          bg: "#FEE2E2",
          title: "Drowsiness Detected",
          time: "8.45 AM",
          level: "Critical",
          levelBg: "#FEE2E2",
          levelColor: "#DC2626",
        },
        {
          icon: "⚠️",
          bg: "#FEF3C7",
          title: "Aggressive Braking",
          time: "8.45 AM",
          level: "Medium",
          levelBg: "#FEF3C7",
          levelColor: "#F59E0B",
        },
        {
          icon: "🚗",
          bg: "#DBEAFE",
          title: "Over-speeding",
          time: "8.45 AM",
          level: "Low",
          levelBg: "#DBEAFE",
          levelColor: "#2563EB",
        },
      ].map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: item.bg,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {item.time}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: item.levelBg,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: item.levelColor,
              }}
            >
              {item.level}
            </Text>
          </View>
        </View>
      ))}

      {/* Yesterday */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#111827",
          marginVertical: 12,
        }}
      >
        Yesterday
      </Text>

      {[
        {
          icon: "🌙",
          bg: "#FEE2E2",
          title: "Drowsiness Detected",
          time: "8.45 AM",
          level: "Critical",
          levelBg: "#FEE2E2",
          levelColor: "#DC2626",
        },
        {
          icon: "⚠️",
          bg: "#FEF3C7",
          title: "Aggressive Braking",
          time: "8.45 AM",
          level: "Medium",
          levelBg: "#FEF3C7",
          levelColor: "#F59E0B",
        },
        {
          icon: "🚗",
          bg: "#DBEAFE",
          title: "Over-speeding",
          time: "8.45 AM",
          level: "Low",
          levelBg: "#DBEAFE",
          levelColor: "#2563EB",
        },
      ].map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: item.bg,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {item.time}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: item.levelBg,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: item.levelColor,
              }}
            >
              {item.level}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
