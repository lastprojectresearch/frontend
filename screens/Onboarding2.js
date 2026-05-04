import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Onboarding2Image = require('../assets/onboarding_screen_1.jpeg');

const Onboarding2 = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('WelcomeScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      <Image
        source={Onboarding2Image}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>ANZEN</Text>
      <Text style={styles.subtitle}>AI That Watches the Road for You</Text>
      <Text style={styles.description}>
        Powered by intelligent analysis of hazards, driver behavior, and road
        conditions — with automatic emergency response in critical situations.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGetStarted}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  topImage: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  title: {
    color: '#0F172A',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  description: {
    color: '#0F172A',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    width: '80%',
    backgroundColor: '#22C55E',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});