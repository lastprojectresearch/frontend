import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Homedriver() {
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
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              marginRight: 12,
            }}
          />

          <View>
            <Text style={{ color: "#2563EB", fontSize: 14, fontWeight: "600" }}>
              Welcome Back
            </Text>
            <Text style={{ color: "#111827", fontSize: 18, fontWeight: "700" }}>
              Lakshitha
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 20 }}>🔔</Text>
      </View>

      {/* Safety Score */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 20,
          marginBottom: 30,
          elevation: 3,
        }}
      >
        <Text style={{ color: "#6B7280", fontWeight: "600" }}>
          Safety Score
        </Text>

        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 10,
              borderColor: "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: "700" }}>55</Text>
          </View>
        </View>

        <Text style={{ color: "#6B7280", textAlign: "center" }}>
          Excellent driving. Your braking patterns have improved today.
        </Text>
      </View>

      {/* Current Status */}
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        Current Status
      </Text>

      <View
        style={{
          backgroundColor: "#22C55E",
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          SAFE DRIVING
        </Text>
      </View>
    </ScrollView>
  );
}
