import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import regImage from '../assets/images/reg.png';

export default function EmergencyRegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    orgType: '',
    orgName: '',
    city: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  /* VALIDATION */
  const validate = () => {
    let newErrors = {};

    if (!form.orgType) newErrors.orgType = 'Select organization type';
    if (!form.orgName.trim()) newErrors.orgName = 'Organization name required';
    if (!form.city.trim()) newErrors.city = 'City required';

    if (!form.phone) {
      newErrors.phone = 'Contact number required';
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Must be exactly 10 digits';
    }

    if (!form.password) newErrors.password = 'Password required';
    if (!form.confirmPassword)
      newErrors.confirmPassword = 'Confirm password required';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    navigation.navigate('EmergencyDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <View style={styles.illustrationContainer}>
          <Image source={regImage} style={styles.image} resizeMode="contain" />
        </View>

        {/* TITLE */}
        <Text style={styles.heading}>
          Join us and get started today
        </Text>

        <View style={styles.card}>
          {/* ORGANIZATION TYPE */}
          <Text style={styles.label}>Organization Type</Text>
          <View style={styles.field}>
            <Ionicons name="business" size={20} color="#9ca3af" />
            <Picker
              selectedValue={form.orgType}
              onValueChange={(v) => handleChange('orgType', v)}
              style={styles.picker}
            >
              <Picker.Item label="Select organization type" value="" />
              <Picker.Item label="Hospital" value="hospital" />
              <Picker.Item label="Police" value="police" />
            </Picker>
          </View>
          {errors.orgType && <Text style={styles.error}>{errors.orgType}</Text>}

          {/* ORGANIZATION NAME */}
          <Text style={styles.label}>Organization Name</Text>
          <View style={styles.field}>
            <Ionicons name="business" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Enter organization name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={form.orgName}
              onChangeText={(v) => handleChange('orgName', v)}
            />
          </View>
          {errors.orgName && <Text style={styles.error}>{errors.orgName}</Text>}

          {/* CITY */}
          <Text style={styles.label}>City</Text>
          <View style={styles.field}>
            <Ionicons name="location" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Enter city"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={form.city}
              onChangeText={(v) => handleChange('city', v)}
            />
          </View>
          {errors.city && <Text style={styles.error}>{errors.city}</Text>}

          {/* CONTACT */}
          <Text style={styles.label}>Contact Number</Text>
          <View style={styles.field}>
            <Ionicons name="call" size={20} color="#9ca3af" />
            <TextInput
              placeholder="07XXXXXXXX"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              value={form.phone}
              onChangeText={(v) =>
                handleChange('phone', v.replace(/[^0-9]/g, ''))
              }
            />
          </View>
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.field}>
            <Ionicons name="lock-closed" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Create password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              style={styles.input}
              value={form.password}
              onChangeText={(v) => handleChange('password', v)}
            />
          </View>
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {/* CONFIRM PASSWORD */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.field}>
            <Ionicons name="lock-closed" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(v) => handleChange('confirmPassword', v)}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          By registering, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  illustrationContainer: {
    alignItems: 'center',
    marginTop: 24,
  },

  image: {
    width: 260,
    height: 180,
  },

  heading: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 20,
    color: '#111827',
  },

  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  label: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  picker: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  error: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  button: {
    backgroundColor: '#0f172a',
    height: 54,
    borderRadius: 14,
    marginTop: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    marginVertical: 24,
    paddingHorizontal: 20,
  },

  link: {
    fontWeight: '700',
    color: '#111827',
  },
});
