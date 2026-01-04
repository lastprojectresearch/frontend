import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Log from './Log';
import Smap from './Smap';

const Stack = createNativeStackNavigator();

// Entry Home screen inside the Environment stack
function Home({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 40,
        }}
      >
        Driver Safety System
      </Text>

      {/* LOG BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Log')}
        style={{
          width: 200,
          padding: 15,
          backgroundColor: '#1e90ff',
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>Log</Text>
      </TouchableOpacity>

      {/* MAP BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Smap')}
        style={{
          width: 200,
          padding: 15,
          backgroundColor: '#e53935',
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>Map</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stack navigator for Environment tab
export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeEnv" component={Home} />
      <Stack.Screen name="Log" component={Log} />
      <Stack.Screen name="Smap" component={Smap} />
    </Stack.Navigator>
  );
}
