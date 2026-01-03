import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";

export default function DrivingAnalysisScreen() {
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
          Driving Analysis
        </Text>
      </View>

      {/* Monitoring Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: 16,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: "#6B7280",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          Monitoring
        </Text>

        <View
          style={{
            backgroundColor: "#1E293B",
            borderRadius: 14,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Camera Status
          </Text>

          <Switch
            value={true}
            trackColor={{ false: "#CBD5E1", true: "#FACC15" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Alert Card */}
      <View
        style={{
          backgroundColor: "#FEE2E2",
          borderRadius: 18,
          padding: 18,
          marginBottom: 30,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>⚠️</Text>
          <Text
            style={{
              color: "#DC2626",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Drowsiness Detected
          </Text>
        </View>

        <Text
          style={{
            color: "#991B1B",
            fontSize: 14,
            marginTop: 10,
            lineHeight: 20,
          }}
        >
          Facial patterns indicate high fatigue levels.
          Please pull over and take a break immediately
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Dismiss Alert
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#111827",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Find Rest Stop
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Metrics Header */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 16,
        }}
      >
        Real Time Metrics
      </Text>

      {/* Metrics Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {[
          { label: "Stress Level", color: "#1D4ED8", bg: "#DBEAFE", value: "70%" },
          { label: "Fatigue", color: "#F59E0B", bg: "#FEF3C7", value: "65%" },
          { label: "Aggression", color: "#22C55E", bg: "#DCFCE7", value: "50%" },
          { label: "Drowsiness", color: "#EF4444", bg: "#FEE2E2", value: "80%" },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              width: "48%",
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                backgroundColor: item.bg,
                marginBottom: 12,
              }}
            />

            <Text
              style={{
                color: "#6B7280",
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              {item.label}
            </Text>

            <View
              style={{
                height: 8,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: item.value,
                  height: "100%",
                  backgroundColor: item.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
