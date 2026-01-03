import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './screens/MapScreen';
import HomeScreen from './screens/HomeScreen';
import BottomNavigation from './components/BottomNavigation';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <BottomNavigation {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="DriverAnalytics" component={PlaceholderScreen} options={{ title: 'Driver Analytics' }} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Emergency" component={PlaceholderScreen} options={{ title: 'Emergency Response' }} />
        <Tab.Screen name="Environment" component={PlaceholderScreen} options={{ title: 'Environment Analytics' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Placeholder for future screens
function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <Text style={{ color: '#020617', fontSize: 20 }}>{route.name} - Coming Soon</Text>
    </View>
  );
}