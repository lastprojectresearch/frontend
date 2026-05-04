import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 30,
        justifyContent: "space-between",
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      {/* Logo Section */}
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Image
          source={require('../assets/anzen.png')}
          style={{ width: 280, height: 280 }}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <View style={{ alignItems: "center", marginTop: -20 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#1F2937",
            textAlign: "center",
            lineHeight: 42,
          }}
        >
         
        </Text>
      </View>

      {/* Description Section */}
      <View style={{ alignItems: "center", paddingHorizontal: 10, marginTop: 16 }}>
        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          Get real-time assistance, clear navigation, and smart alerts to help you stay safe on every trip.
        </Text>
      </View>

      {/* Buttons Section */}
      <View style={{ marginTop: 40, gap: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#1E293B",
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => navigation.navigate('Login')}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#E5E7EB",
          }}
          onPress={() => navigation.navigate('Register')}
        >
          <Text
            style={{
              color: "#1F2937",
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}