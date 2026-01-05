import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Homedriver({ navigation }) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 20,
        paddingTop: 50,
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
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 12,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text style={{ color: "#2563EB", fontSize: 16, fontWeight: "600" }}>
              Welcome Back
            </Text>
            <Text style={{ color: "#111827", fontSize: 22, fontWeight: "700", marginTop: 2 }}>
              Lakshitha
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#F3F4F6",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Access Cards */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AlertsWarningsScreen')}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginRight: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#FEF3C7",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 20 }}>⚠️</Text>
          </View>
          <Text style={{ color: "#111827", fontSize: 15, fontWeight: "700", marginBottom: 4 }}>
            Alerts &
          </Text>
          <Text style={{ color: "#111827", fontSize: 15, fontWeight: "700" }}>
            Warnings
          </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}>
            <View style={{
              backgroundColor: "#FACC15",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
              <Text style={{ color: "#78350F", fontSize: 12, fontWeight: "700" }}>3 Today</Text>
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 18 }}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('DrivingAnalysisScreen')}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginLeft: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#DBEAFE",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 20 }}>📊</Text>
          </View>
          <Text style={{ color: "#111827", fontSize: 15, fontWeight: "700", marginBottom: 4 }}>
            Driving
          </Text>
          <Text style={{ color: "#111827", fontSize: 15, fontWeight: "700" }}>
            Analysis
          </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}>
            <View style={{
              backgroundColor: "#DCFCE7",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
              <Text style={{ color: "#166534", fontSize: 12, fontWeight: "700" }}>Active</Text>
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 18 }}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Safety Score Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ color: "#9CA3AF", fontSize: 15, fontWeight: "500" }}>
            Safety Score
          </Text>
          <TouchableOpacity style={{
            backgroundColor: "#DBEAFE",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{ color: "#2563EB", fontSize: 13, fontWeight: "600" }}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              borderWidth: 16,
              borderColor: "#E5E7EB",
              borderTopColor: "#3B82F6",
              borderRightColor: "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ rotate: '-45deg' }],
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: "700", color: "#111827", transform: [{ rotate: '45deg' }] }}>55</Text>
          </View>
        </View>

        <Text style={{ color: "#6B7280", textAlign: "center", fontSize: 14, lineHeight: 20 }}>
          Excellent driving. Your braking patterns have improved significantly today.
        </Text>
      </View>

      {/* Current Status */}
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 12 }}>
        Current Status
      </Text>

      <View
        style={{
          backgroundColor: "#10B981",
          paddingVertical: 18,
          paddingHorizontal: 20,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          shadowColor: "#10B981",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}>
          <Text style={{ fontSize: 18 }}>🛡️</Text>
        </View>
        <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 }}>
          SAFE DRIVING
        </Text>
      </View>

      {/* Metrics */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
          Metrics
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", marginRight: 6 }} />
          <Text style={{ color: "#6B7280", fontSize: 13, fontWeight: "500" }}>
            Monitoring
          </Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <View style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          flex: 1,
          marginRight: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 6 }}>Stress Level</Text>
          <Text style={{ color: "#111827", fontSize: 18, fontWeight: "700" }}>Low</Text>
        </View>

        <View style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          flex: 1,
          marginLeft: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 6 }}>Drowsiness</Text>
          <Text style={{ color: "#111827", fontSize: 18, fontWeight: "700" }}>Awake</Text>
        </View>
      </View>

      {/* Average Speed */}
      <View style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 8 }}>Average Speed</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={{ color: "#111827", fontSize: 40, fontWeight: "700" }}>54</Text>
            <Text style={{ color: "#6B7280", fontSize: 16, marginLeft: 4, marginBottom: 6 }}>mph</Text>
          </View>
          <View style={{
            backgroundColor: "#D1FAE5",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{ color: "#059669", fontSize: 13, fontWeight: "600" }}>
              Excellent
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}