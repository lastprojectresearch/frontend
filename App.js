import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { NavigationContainer, useFocusEffect  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens

import Home from './screens/Home';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import WelcomeScreen from './screens/WelcomeScreen';
import BottomNavigation from './components/BottomNavigation';
import EmergencyScreen from './screens/Emergency';



// Import all your screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import Homedriver from './screens/Homedriver';
import ProfileScreen from './screens/ProfileScreen';
import AlertsWarningsScreen from './screens/AlertsWarningsScreen';
import DrivingAnalysisScreen from './screens/DrivingAnalysisScreen';
import Register from "./screens/register";
import Login from './screens/Login';

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
        component={Homedriver}
      />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
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
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
        <Stack.Screen name="Homedriver" component={Homedriver} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AlertsWarningsScreen" component={AlertsWarningsScreen} />
        <Stack.Screen name="DrivingAnalysisScreen" component={DrivingAnalysisScreen} />
        {/* Step 2: Main app */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
