import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Ride Safe System</Text>
        <Text style={styles.subtitle}>
          Choose your role to continue
        </Text>
      </View>

      {/* CARDS */}
      <View style={styles.cards}>

        {/* DRIVER */}
        <TouchableOpacity
          style={[styles.card, styles.driverCard]}
          onPress={() => navigation.navigate('Driver')}
          activeOpacity={0.85}
        >
          <View style={styles.iconWrapBlue}>
            <Ionicons name="car" size={28} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Driver Interface</Text>
            <Text style={styles.cardDesc}>
              Accident detection & passenger monitoring
            </Text>
          </View>
        </TouchableOpacity>

        {/* EMERGENCY */}
        <TouchableOpacity
          style={[styles.card, styles.emergencyCard]}
          onPress={() => navigation.navigate('EmergencyDashboard')}
          activeOpacity={0.85}
        >
          <View style={styles.iconWrapRed}>
            <Ionicons name="alert-circle" size={28} color="#DC2626" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Emergency Interface</Text>
            <Text style={styles.cardDesc}>
              Police & hospital emergency management
            </Text>
          </View>
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
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  cards: {
    gap: 18,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  driverCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },

  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },

  iconWrapBlue: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  iconWrapRed: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
    maxWidth: 220,
  },
});
