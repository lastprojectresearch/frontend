import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingImage = require('../assets/onboarding_screen_1.jpeg');

const Onboarding1 = () => {
  const navigation = useNavigation(); 
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('Onboarding2'); // 
    });
  }, [loadingAnim, navigation]); // 

  const loadingWidth = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      <Image
        source={OnboardingImage}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.loadingContainer}>
        <Animated.View
          style={[styles.loadingFill, { width: loadingWidth }]}
        />
      </View>
    </View>
  );
};

export default Onboarding1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  loadingContainer: {
    width: '70%',
    height: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0F172A',
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 6,
  },
});
