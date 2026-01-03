import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="alert-circle" size={64} color="#DC2626" />
        </View>

        <Text style={styles.title}>Emergency Services</Text>
        <Text style={styles.subtitle}>
          Police & Hospital Emergency Management
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>

        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => navigation.navigate('EmergencyRegister')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            Register Emergency Organization
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => navigation.navigate('HospitalDashboard')}
        >
          <Ionicons name="medkit-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            Hospital Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => navigation.navigate('PoliceDashboard')}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            Police Dashboard
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 48,
  },

  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },

  actions: {
    gap: 16,
  },

  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  primary: {
    backgroundColor: '#DC2626',
  },

  secondary: {
    backgroundColor: '#0F172A',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
