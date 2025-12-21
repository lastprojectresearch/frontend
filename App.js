import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ headerShown: false }}  // Hide default header for full-screen map
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}