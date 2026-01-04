import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, StatusBar, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/anzen.png'

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = createStyles(isDark);

  return (
    <View style={styles.wrapper}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F172A' : '#FFFFFF'}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Modern Header */}
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
          
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="speedometer-outline" size={24} color="#22C55E" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="warning-outline" size={24} color="#EF4444" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Hazards Avoided</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="play-circle" size={32} color="#22C55E" />
              </View>
              <Text style={styles.actionText}>Start Ride</Text>
              <Text style={styles.actionSubtext}>Begin tracking</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="warning" size={32} color="#EF4444" />
              </View>
              <Text style={styles.actionText}>View Hazards</Text>
              <Text style={styles.actionSubtext}>See nearby alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyState}>
            <Ionicons name="bicycle-outline" size={64} color={isDark ? '#475569' : '#CBD5E1'} />
            <Text style={styles.emptyStateText}>No recent rides yet</Text>
            <Text style={styles.emptyStateSubtext}>Start your first ride to see activity here</Text>
          </View>
        </View>

        {/* Safety Tips Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Alert</Text>
              <Text style={styles.tipText}>Always be aware of your surroundings and report hazards you encounter</Text>
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
    paddingBottom: 20,
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
    marginBottom: 24,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 12,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionText: {
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtext: {
    color: isDark ? '#94A3B8' : '#64748B',
    fontSize: 12,
    textAlign: 'center',
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