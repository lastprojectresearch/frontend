import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

export default function LoginScreen({ navigation }) {
  const handleSignIn = () => {
    // Add your login logic here (e.g., API call, authentication)
    // Then navigate to MainTabs (Home)
    navigation.replace('MainTabs', { screen: 'Home' });
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 50 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Login here
        </Text>

        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#374151",
            textAlign: "center",
          }}
        >
          Welcome back you've been missed!
        </Text>
      </View>

      {/* Email Input */}
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
          autoCapitalize="none"
          style={{
            fontSize: 16,
            color: "#111827",
          }}
        />
      </View>

      {/* Password Input */}
      <View
        style={{
          backgroundColor: "#F1F5FF",
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginBottom: 14,
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

      {/* Forgot Password */}
      <TouchableOpacity style={{ alignItems: "flex-end", marginBottom: 28 }}>
        <Text
          style={{
            color: "#111827",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Forgot your password?
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
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
        onPress={handleSignIn}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Sign in
        </Text>
      </TouchableOpacity>

      {/* Create Account */}
      <TouchableOpacity 
        style={{ marginTop: 24, alignItems: "center" }}
        onPress={handleCreateAccount}
      >
        <Text
          style={{
            color: "#6B7280",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Create new account
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
          {["G", "f", "X"].map((icon, index) => (
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
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}