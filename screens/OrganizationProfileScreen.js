import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function OrganizationProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      
      {/* PROFILE IMAGE */}
      <View style={styles.profileContainer}>
        <View style={styles.profilePic}>
          <Feather name="edit-2" size={18} color="#1F2937" style={styles.editIcon} />
        </View>
      </View>

      {/* ORGANIZATION INFO */}
      <Section title="Organization Information" icon="business">
        <Input label="Organization Name" value="Central Hospital Colombo" />
        <Input label="Contact Number" value="+94 11 269 1111" />
        <Input label="Emergency Hotline" value="+94 11 269 2222" />
        <Input label="Email Address" value="emergency@centralhospital.lk" />
      </Section>

      {/* LOCATION */}
      <Section title="Location & Coverage" icon="location">
        <Row>
          <Input label="City" value="Colombo" small />
          <Input label="District" value="Colombo" small />
        </Row>
        <Input label="Province" value="Western" />
      </Section>

      {/* AMBULANCE */}
      <Section title="Ambulance Capacity" icon="car">
        <Row>
          <Input label="Suwasariya" value="0" small />
          <Input label="Hospital" value="3" small />
        </Row>
      </Section>

      {/* ACCOUNT */}
      <Section title="Account Management" icon="settings">
        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </Section>

      {/* ACTION BUTTONS */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.deactivateBtn}>
          <Text style={styles.deactivateText}>Deactivate Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

const Section = ({ title, icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#1F2937" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Input = ({ label, value, small }) => (
  <View style={[styles.inputWrap, small && { flex: 1 }]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} style={styles.input} editable={false} />
  </View>
);

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row', gap: 12 }}>{children}</View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    backgroundColor: '#1F2937',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  profileContainer: { alignItems: 'center', marginVertical: 20 },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },

  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: '700', fontSize: 15 },

  inputWrap: { marginBottom: 12 },
  label: { fontSize: 12, color: '#374151', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  actionRow: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: { fontWeight: '600' },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  deactivateBtn: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 14,
    flex: 1,
    marginRight: 10,
  },
  deactivateText: { color: '#fff', textAlign: 'center', fontWeight: '700' },

  editBtn: {
    backgroundColor: '#1F2937',
    padding: 14,
    borderRadius: 14,
    flex: 1,
  },
  editText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
