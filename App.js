import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomNavigation from './components/BottomNavigation';

// Import all your screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import Homedriver from './screens/Homedriver';
const Tab = createBottomTabNavigator();

// Placeholder for any screens you don't have yet
function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <Text style={{ fontSize: 20, color: '#020617' }}>{route.name} - Coming Soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <BottomNavigation {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="DriverAnalytics" component={Homedriver} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Emergency" component={PlaceholderScreen} options={{ title: 'Emergency Response' }} />
        <Tab.Screen name="Environment" component={PlaceholderScreen} options={{ title: 'Environment Analytics' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
