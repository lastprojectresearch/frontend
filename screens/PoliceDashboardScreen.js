import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';

const ICON_COLOR = '#1E293B';

export default function PoliceDashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.avatar} />
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <Text style={styles.title}>Colombo Central Police Station</Text>
        <Text style={styles.subtitle}>Colombo, Western Province</Text>
      </View>

      {/* SEVERITY NOTIFICATION PANEL */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.severityCard}
        onPress={() => navigation.navigate('EmergencyDetails')}
      >
        {/* TOP */}
        <View style={styles.severityTop}>
          <View style={styles.severityBadge}>
            <Ionicons name="flash" size={14} color="#EF4444" />
            <Text style={styles.severityBadgeText}>HIGH SEVERITY</Text>
          </View>

          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.timeText}>14:23</Text>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.severityRow}>
          <Ionicons name="location-sharp" size={14} color="#FACC15" />
          <Text style={styles.severityText}>
            Galle Road, Bambalapitiya
          </Text>
        </View>

        {/* PASSENGERS */}
        <View style={styles.severityBottom}>
          <View style={styles.severityRow}>
            <Ionicons name="people" size={14} color="#FACC15" />
            <Text style={styles.severityText}>4 Passengers</Text>
          </View>

          <View style={styles.criticalBadge}>
            <Text style={styles.criticalText}>Critical</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* SUWASARIYA AMBULANCE CARD */}
      <View style={styles.ambulanceCard}>
        <View style={styles.row}>
          <FontAwesome5 name="ambulance" size={18} color={ICON_COLOR} />
          <Text style={styles.ambulanceText}>Suwasariya Ambulances</Text>
        </View>

        <View style={styles.countBox}>
          <Text style={styles.countText}>1</Text>
        </View>
      </View>

      {/* NEAREST HOSPITALS */}
      <TouchableOpacity
        style={styles.infoCard}
        onPress={() =>
          navigation.navigate('EmergencyDetails', {
            name: 'Central Hospital Colombo',
            contact: '+94 11 269 1111',
            hotline: '+94 11 269 2222',
            email: 'emergency@centralhospital.lk',
            city: 'Colombo',
            district: 'Colombo',
            province: 'Western',
            suwasariya: 0,
            hospitalAmbulances: 3,
          })
        }
      >
        <View>
          <Text style={styles.infoTitle}>Central Hospital</Text>
          <Text style={styles.infoSub}>011-2345678</Text>
        </View>

        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>0.7 km</Text>
        </View>
      </TouchableOpacity>


      <View style={styles.infoCard}>
        <View>
          <Text style={styles.infoTitle}>General Hospital</Text>
          <View style={styles.row}>
            <Ionicons name="call" size={15} color={ICON_COLOR} />
            <Text style={styles.infoSub}>011-2345678</Text>
          </View>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>1.2 km</Text>
        </View>
      </View>


      {/* NEAREST POLICE STATIONS */}
      <View style={styles.sectionRow}>
        <Ionicons name="location-outline" size={25} color={ICON_COLOR} />
        <Text style={styles.sectionTitle}>Nearest Police Stations</Text>
      </View>

      <View style={styles.infoCard}>
        <View>
          <Text style={styles.infoTitle}>Kollupitiya Police Station</Text>
          <View style={styles.row}>
            <Ionicons name="call" size={15} color={ICON_COLOR} />
            <Text style={styles.infoSub}>011-2345678</Text>
          </View>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>1.2 km</Text>
        </View>
      </View>

    </ScrollView>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  onlinePill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    marginRight: 6,
  },
  onlineText: { fontWeight: '600', fontSize: 12 },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
  },
  subtitle: { color: '#D1D5DB', marginTop: 4 },

  severityCard: {
    backgroundColor: '#F87171',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  severityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityBadge: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  severityBadgeText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    backgroundColor: '#FCA5A5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  timeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  severityRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FB7185',
    padding: 10,
    borderRadius: 12,
  },
  severityText: { color: '#fff', fontWeight: '600' },

  severityBottom: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  criticalBadge: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  criticalText: { fontWeight: '700' },

  ambulanceCard: {
    backgroundColor: '#22C55E',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  ambulanceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  countBox: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { color: '#fff', fontSize: 22, fontWeight: '700' },

  sectionRow: {
    marginTop: 24,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: { fontWeight: '700', fontSize: 14 },

  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  infoTitle: { fontWeight: '700' },
  infoSub: { marginLeft: 6, marginTop: 6, color: '#374151' },

  distanceBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanceText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
