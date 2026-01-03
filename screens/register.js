import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

export default function RegisterScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
        paddingTop: 60,
      }}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Create Account
        </Text>

        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#374151",
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          Create an account so you can explore all the existing jobs
        </Text>
      </View>

      {/* Email */}
      <View
        style={{
          backgroundColor: "#F1F5FF",
          borderRadius: 14,
          borderWidth: 2,
          borderColor: "#2563EB",
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginBottom: 18,
        }}
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          style={{
            fontSize: 16,
            color: "#111827",
          }}
        />
      </View>

      {/* Password */}
      <View
        style={{
          backgroundColor: "#F1F5FF",
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginBottom: 18,
        }}
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          style={{
            fontSize: 16,
            color: "#111827",
          }}
        />
      </View>

      {/* Confirm Password */}
      <View
        style={{
          backgroundColor: "#F1F5FF",
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginBottom: 28,
        }}
      >
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          style={{
            fontSize: 16,
            color: "#111827",
          }}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#1F2937",
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Sign up
        </Text>
      </TouchableOpacity>

      {/* Already Have Account */}
      <TouchableOpacity style={{ marginTop: 26, alignItems: "center" }}>
        <Text
          style={{
            color: "#6B7280",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Already have an account
        </Text>
      </TouchableOpacity>

      {/* Social Login */}
      <View style={{ marginTop: 48, alignItems: "center" }}>
        <Text
          style={{
            color: "#2563EB",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 20,
          }}
        >
          Or continue with
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          {["G", "f", ""].map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {icon}
	tr
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
