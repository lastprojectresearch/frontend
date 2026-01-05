import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, StatusBar, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/anzen.png';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.wrapper}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F172A' : '#F8FAFC'}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Enhanced Header with Time */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Image 
                source={Logo}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.headerText}>Primal</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={26} color={isDark ? '#F8FAFC' : '#0F172A'} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Real-time Date & Time Display */}
          <View style={styles.dateTimeCard}>
            <View style={styles.dateTimeContent}>
              <Ionicons name="time-outline" size={20} color="#22C55E" />
              <View style={styles.dateTimeText}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
              </View>
            </View>
          </View>
          
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="speedometer-outline" size={24} color="#22C55E" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#22C55E" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Safe Miles</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="warning-outline" size={24} color="#FACC15" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Hazards Detected</Text>
            </View>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.startRideButton}>
            <View style={styles.startRideContent}>
              <Ionicons name="play-circle" size={32} color="#FFFFFF" />
              <View style={styles.startRideTextContainer}>
                <Text style={styles.startRideText}>Start Ride</Text>
                <Text style={styles.startRideSubtext}>Begin safe journey monitoring</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Emergency SOS Button */}
          <TouchableOpacity style={styles.sosButton}>
            <Ionicons name="alert-circle" size={28} color="#FFFFFF" />
            <Text style={styles.sosText}>EMERGENCY SOS</Text>
            <Text style={styles.sosSubtext}>Press and hold for 3 seconds</Text>
          </TouchableOpacity>
        </View>

        {/* System Monitoring Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Monitoring</Text>
          <View style={styles.monitoringCard}>
            <View style={styles.monitoringHeader}>
              <View style={styles.statusIndicator}>
                <View style={styles.pulseOuter}>
                  <View style={styles.pulseInner} />
                </View>
                <Text style={styles.statusText}>All Systems Active</Text>
              </View>
              <Text style={styles.statusSubtext}>Real-time protection enabled</Text>
            </View>

            <View style={styles.systemGrid}>
              <View style={styles.systemItem}>
                <View style={styles.systemIcon}>
                  <Ionicons name="warning" size={24} color="#22C55E" />
                </View>
                <Text style={styles.systemLabel}>Hazard{'\n'}Detection</Text>
              </View>

              <View style={styles.systemItem}>
                <View style={styles.systemIcon}>
                  <Ionicons name="analytics" size={24} color="#22C55E" />
                </View>
                <Text style={styles.systemLabel}>Driver{'\n'}Behavior</Text>
              </View>

              <View style={styles.systemItem}>
                <View style={styles.systemIcon}>
                  <Ionicons name="navigate" size={24} color="#22C55E" />
                </View>
                <Text style={styles.systemLabel}>Road{'\n'}Analysis</Text>
              </View>

              <View style={styles.systemItem}>
                <View style={styles.systemIcon}>
                  <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
                </View>
                <Text style={styles.systemLabel}>Accident{'\n'}Detection</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="warning-outline" size={28} color="#FACC15" />
              <Text style={styles.featureText}>View{'\n'}Hazards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="map-outline" size={28} color="#22C55E" />
              <Text style={styles.featureText}>Live{'\n'}Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="analytics-outline" size={28} color="#3B82F6" />
              <Text style={styles.featureText}>Drive{'\n'}Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="settings-outline" size={28} color="#64748B" />
              <Text style={styles.featureText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyState}>
            <Ionicons name="car-sport-outline" size={64} color={isDark ? '#475569' : '#CBD5E1'} />
            <Text style={styles.emptyStateText}>No recent rides yet</Text>
            <Text style={styles.emptyStateSubtext}>Start your first ride to begin tracking your safe driving journey</Text>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Safety Reminder</Text>
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Drive Safe, Stay Alert</Text>
              <Text style={styles.tipText}>Anzen monitors your journey in real-time. Focus on the road while we watch for hazards and ensure your safety.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    marginBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  welcomeText: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 14,
    marginBottom: 4,
  },
  headerText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: isDark ? '#1E293B' : '#FFFFFF',
  },
  dateTimeCard: {
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
  },
  timeText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  dateText: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 11,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
  startRideButton: {
    backgroundColor: '#22C55E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#22C55E',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  startRideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  startRideTextContainer: {
    flex: 1,
  },
  startRideText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  startRideSubtext: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },
  sosButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  sosSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  monitoringCard: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  monitoringHeader: {
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  pulseOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  statusText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  statusSubtext: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 13,
    marginLeft: 28,
  },
  systemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  systemItem: {
    width: '47%',
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  systemIcon: {
    marginBottom: 8,
  },
  systemLabel: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  featureText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyState: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipText: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});