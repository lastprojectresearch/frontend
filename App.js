import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MapScreen from './screens/MapScreen';
import HomeScreen from './screens/HomeScreen';
import Home from './screens/Home';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import BottomNavigation from './components/BottomNavigation';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen
        name="DriverAnalytics"
        component={PlaceholderScreen}
        options={{ title: 'Driver Analytics' }}
      />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Emergency"
        component={PlaceholderScreen}
        options={{ title: 'Emergency Response' }}
      />
      <Tab.Screen name="Environment" component={Home} />
    </Tab.Navigator>
  );
}

// Placeholder for future screens
function PlaceholderScreen({ route }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
      }}
    >
      <Text style={{ color: '#020617', fontSize: 20 }}>
        {route.name} - Coming Soon
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Step 1: Onboarding screens */}
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        {/* Step 2: Main app */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
