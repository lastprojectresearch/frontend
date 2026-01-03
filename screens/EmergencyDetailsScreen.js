import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HospitalDetailsScreen({ route }) {
  const {
    name,
    contact,
    hotline,
    email,
    city,
    district,
    province,
    suwasariya,
    hospitalAmbulances,
  } = route.params;

  // ✅ Correct location for Central Hospital Colombo
  const latitude = 6.9271;
  const longitude = 79.8612;

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PROFILE IMAGE */}
      <View style={styles.profileContainer}>
        <View style={styles.profilePic} />
      </View>

      {/* ORGANIZATION INFO */}
      <Section title="Organization Information" icon="business">
        <Field label="Organization Name" value={name} />
        <Field label="Contact Number" value={contact} />
        <Field label="Emergency Hotline" value={hotline} />
        <Field label="Email Address" value={email} />
      </Section>

      {/* LOCATION */}
      <Section title="Location & Coverage" icon="location">
        <Row>
          <Field label="City" value={city} small />
          <Field label="District" value={district} small />
        </Row>
        <Field label="Province" value={province} />
      </Section>

      {/* AMBULANCE */}
      <Section title="Ambulance Capacity" icon="car">
        <Row>
          <Field label="Suwasariya" value={String(suwasariya)} small />
          <Field
            label="Hospital"
            value={String(hospitalAmbulances)}
            small
          />
        </Row>
      </Section>

      {/* LOCATION BUTTON */}
      <TouchableOpacity style={styles.locationBtn} onPress={openGoogleMaps}>
        <Ionicons name="location-sharp" size={18} color="#fff" />
        <Text style={styles.locationText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- UI HELPERS ---------- */

const Section = ({ title, icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#1F2937" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Field = ({ label, value, small }) => (
  <View style={[styles.fieldWrap, small && { flex: 1 }]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.input}>
      <Text>{value}</Text>
    </View>
  </View>
);

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row', gap: 12 }}>{children}</View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E5E7EB',
  },

  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 15,
  },

  fieldWrap: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  locationBtn: {
    margin: 20,
    backgroundColor: '#1F2937',
    padding: 14,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: '#fff',
    fontWeight: '700',
  },
});
