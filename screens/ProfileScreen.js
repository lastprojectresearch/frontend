import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function ProfileScreen() {
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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Profile
        </Text>

        <Text style={{ fontSize: 18 }}>🔔</Text>
      </View>

      {/* User Card */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#E5E7EB",
            }}
          />

          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#22C55E",
              position: "absolute",
              bottom: 4,
              right: 4,
              borderWidth: 2,
              borderColor: "#F9FAFB",
            }}
          />
        </View>

        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Chamidu Lakshitha
          </Text>

          <Text
            style={{
              color: "#2563EB",
              fontSize: 13,
              marginTop: 2,
            }}
          >
            online
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={{ fontSize: 18 }}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Fields */}
      {[
        { label: "Username", value: "Chamidu Lakshitha" },
        { label: "First Name", value: "Chamidu" },
        { label: "Last Name", value: "Lakshitha" },
        { label: "Date of Birth", value: "23-04-2001" },
        { label: "Age", value: "24 years" },
        { label: "Vehicle Number", value: "AAV - 3456" },
        { label: "Vehicle Type", value: "Car" },
        { label: "Contact Number", value: "056-7898409" },
      ].map((item, index) => (
        <View key={index} style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 14,
              color: "#374151",
              marginBottom: 6,
              fontWeight: "600",
            }}
          >
            {item.label}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#2563EB",
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#D1D5DB",
            }}
          >
            {item.value}
          </Text>
        </View>
      ))}

      {/* Sign Out Button */}
      <TouchableOpacity
        style={{
          marginTop: 30,
          marginBottom: 40,
          backgroundColor: "#1F2937",
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
