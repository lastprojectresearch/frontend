import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { NavigationContainer, useFocusEffect  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import WelcomeScreen from './screens/WelcomeScreen';
import BottomNavigation from './components/BottomNavigation';
import EmergencyScreen from './screens/Emergency';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import Homedriver from './screens/Homedriver';
import ProfileScreen from './screens/ProfileScreen';
import AlertsWarningsScreen from './screens/AlertsWarningsScreen';
import DrivingAnalysisScreen from './screens/DrivingAnalysisScreen';
import Register from './screens/register';
import Login from './screens/Login';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const DriverStackNav = createNativeStackNavigator();  // separate instance

function DriverStack() {
  return (
    <DriverStackNav.Navigator screenOptions={{ headerShown: false }}>
      <DriverStackNav.Screen name="HomedriverMain"        component={Homedriver} />
      <DriverStackNav.Screen name="HistoryScreen"         component={HistoryScreen} />
      <DriverStackNav.Screen name="AlertsWarningsScreen"  component={AlertsWarningsScreen} />
      <DriverStackNav.Screen name="DrivingAnalysisScreen" component={DrivingAnalysisScreen} />
      <DriverStackNav.Screen name="ProfileScreen"         component={ProfileScreen} />
    </DriverStackNav.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Map"             component={MapScreen} />
      <Tab.Screen name="DriverAnalytics" component={DriverStack} />
      <Tab.Screen name="Home"            component={HomeScreen} />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ title: 'Emergency Response' }}
      />
      <Tab.Screen name="Environment"     component={Home} />
    </Tab.Navigator>
  );
}

function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <Text style={{ color: '#020617', fontSize: 20 }}>
        {route.name} - Coming Soon
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Onboarding1"   component={Onboarding1} />
        <RootStack.Screen name="Onboarding2"   component={Onboarding2} />
        <RootStack.Screen name="Register"      component={Register} />
        <RootStack.Screen name="Login"         component={Login} />
        <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <RootStack.Screen name="MainTabs"      component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}