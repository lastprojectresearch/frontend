import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import DriverScreen from './screens/DriverScreen';
import EmergencyRegisterScreen from './screens/EmergencyRegisterScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import HospitalDashboard from './screens/HospitalDashboard';
import PoliceDashboardScreen from './screens/PoliceDashboardScreen';
import OrganizationProfileScreen from './screens/OrganizationProfileScreen';
import EmergencyDetailsScreen from './screens/EmergencyDetailsScreen';
import EmergencyAlertScreen from './screens/EmergencyAlertScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F2937', // dark header
          },
          headerTintColor: '#FFFFFF', // back arrow + title
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        {/* HOME */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />

        {/* DRIVER */}
        <Stack.Screen
          name="Driver"
          component={DriverScreen}
          options={{ title: 'Driver' }}
        />

        {/* EMERGENCY REGISTER */}
        <Stack.Screen
          name="EmergencyRegister"
          component={EmergencyRegisterScreen}
          options={{ title: 'Emergency Register' }}
        />

        {/* EMERGENCY DASHBOARD */}
        <Stack.Screen
          name="EmergencyDashboard"
          component={EmergencyScreen}
          options={{ title: 'Emergency Dashboard' }}
        />

        {/* HOSPITAL DASHBOARD (NO HEADER) */}
        <Stack.Screen
          name="HospitalDashboard"
          component={HospitalDashboard}
        />

        {/* POLICE DASHBOARD (NO HEADER) */}
        <Stack.Screen
          name="PoliceDashboard"
          component={PoliceDashboardScreen}
        />

        {/* ORGANIZATION PROFILE (KEEP HEADER) */}
        <Stack.Screen
          name="OrganizationProfile"
          component={OrganizationProfileScreen}
          options={{
            title: 'Organization Profile',
          }}
        />


        <Stack.Screen
          name="EmergencyDetails"
          component={EmergencyDetailsScreen}
          options={{
            title: 'Emergeny Details',
          }}
        />

        <Stack.Screen
          name="EmergencyAlert"
          component={EmergencyAlertScreen}
          options={{
            title: 'Emergency Alerts',
            headerShown: true,
          }}
        />
              </Stack.Navigator>
    </NavigationContainer>
  );
}
