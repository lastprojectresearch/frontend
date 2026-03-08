import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverScreen() {
  const [time, setTime] = useState(new Date());

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: 'Detecting location...',
  });

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [passengers, setPassengers] = useState(0);
  const [severity, setSeverity] = useState('LOADING...');
  const [pollingPaused, setPollingPaused] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('LOW');
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupPassengers, setPopupPassengers] = useState(0);
  const [popupLocation, setPopupLocation] = useState('');
  const [popupButtons, setPopupButtons] = useState([]);

  const VEHICLE_ID = 'LK-AB-1234';
  const DRIVER_NAME = 'Kamal Perera';
  const DRIVER_PHONE = '0782190200';

  // change this IP
  const PC_IP = '172.20.10.2';

  const BACKEND_URL = `http://${PC_IP}:8000/latest`;
  const SAVE_ACCIDENT_URL = `http://${PC_IP}:8000/save-accident`;

  const alertShownRef = useRef(false);
  const lastHandledIncidentRef = useRef('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!locationEnabled) return;

    let subscription = null;
    let isMounted = true;

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) {
            setLocation({
              lat: null,
              lng: null,
              address: 'Location permission denied',
            });
          }
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 3,
          },
          async (pos) => {
            if (!isMounted) return;

            try {
              const { latitude, longitude } = pos.coords;

              const geo = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
              });

              const mainCity =
                geo[0]?.city ||
                geo[0]?.region ||
                geo[0]?.district ||
                'Unknown city';

              setLocation({
                lat: latitude,
                lng: longitude,
                address: `${mainCity}, ${geo[0]?.country || ''}`,
              });

              setLastUpdate(new Date());
            } catch (err) {
              console.log('Reverse geocode error:', err);
            }
          }
        );
      } catch (err) {
        console.log('Location error:', err);
        if (isMounted) {
          setLocation({
            lat: null,
            lng: null,
            address: 'Unable to get location',
          });
        }
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      if (subscription) subscription.remove();
    };
  }, [locationEnabled]);

  const normalizeSeverity = (value) => {
    if (!value) return 'UNKNOWN';

    const s = String(value).trim().toUpperCase();

    if (s.includes('LOW')) return 'LOW';
    if (s.includes('MEDIUM')) return 'MEDIUM';
    if (s.includes('HIGH')) return 'HIGH';
    if (s.includes('NO ACCIDENT')) return 'NO ACCIDENT';
    if (s.includes('SAFE')) return 'NO ACCIDENT';

    return s;
  };

  const saveAccidentToMongo = async (currentSeverity, currentPassengers, currentLocation) => {
    try {
      const payload = {
        vehicle_id: VEHICLE_ID,
        driver_name: DRIVER_NAME,
        phone_number: DRIVER_PHONE,
        severity: currentSeverity,
        passenger_count: currentPassengers,
        location: currentLocation,
        latitude: location.lat,
        longitude: location.lng,
      };

      console.log('Sending payload:', payload);

      const res = await fetch(SAVE_ACCIDENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (!res.ok) {
        throw new Error(data?.detail || 'Save failed');
      }

      return true;
    } catch (err) {
      console.log('Save accident error:', err);
      showPopup({
        type: 'HIGH',
        title: 'Error',
        message: `Failed to save accident details.\n${err.message}`,
        passengers: currentPassengers,
        location: currentLocation,
        buttons: [
          {
            text: 'OK',
            onPress: () => closePopup(),
            styleType: 'danger',
          },
        ],
      });
      return false;
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPollingPaused(false);
    alertShownRef.current = false;
  };

  const showPopup = ({
    type,
    title,
    message,
    passengers,
    location,
    buttons,
  }) => {
    setPopupType(type);
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupPassengers(passengers || 0);
    setPopupLocation(location || 'Unknown location');
    setPopupButtons(buttons || []);
    setPopupVisible(true);
  };

  const showAccidentAlert = (currentSeverity, currentPassengers, currentLocation) => {
    if (alertShownRef.current) return;

    alertShownRef.current = true;
    setPollingPaused(true);

    if (currentSeverity === 'LOW') {
      showPopup({
        type: 'LOW',
        title: 'Low Severity Accident',
        message: 'Accident detected. Do you want to notify police?',
        passengers: currentPassengers,
        location: currentLocation,
        buttons: [
          {
            text: 'No',
            styleType: 'secondary',
            onPress: () => closePopup(),
          },
          {
            text: 'Yes',
            styleType: 'primary',
            onPress: async () => {
              const ok = await saveAccidentToMongo('LOW', currentPassengers, currentLocation);
              if (ok) {
                showPopup({
                  type: 'LOW',
                  title: 'Success',
                  message: 'Police notification saved successfully.',
                  passengers: currentPassengers,
                  location: currentLocation,
                  buttons: [
                    {
                      text: 'OK',
                      styleType: 'primary',
                      onPress: () => closePopup(),
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    } else if (currentSeverity === 'MEDIUM') {
      showPopup({
        type: 'MEDIUM',
        title: 'Medium Severity Accident',
        message: 'Accident detected. Do you want to notify police and hospital?',
        passengers: currentPassengers,
        location: currentLocation,
        buttons: [
          {
            text: 'No',
            styleType: 'secondary',
            onPress: () => closePopup(),
          },
          {
            text: 'Yes',
            styleType: 'primary',
            onPress: async () => {
              const ok = await saveAccidentToMongo('MEDIUM', currentPassengers, currentLocation);
              if (ok) {
                showPopup({
                  type: 'MEDIUM',
                  title: 'Success',
                  message: 'Police and hospital notification saved successfully.',
                  passengers: currentPassengers,
                  location: currentLocation,
                  buttons: [
                    {
                      text: 'OK',
                      styleType: 'primary',
                      onPress: () => closePopup(),
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    } else if (currentSeverity === 'HIGH') {
      (async () => {
        const ok = await saveAccidentToMongo('HIGH', currentPassengers, currentLocation);

        if (ok) {
          showPopup({
            type: 'HIGH',
            title: 'Emergency Alert Sent',
            message: 'High severity accident detected. Emergency notification was sent automatically.',
            passengers: currentPassengers,
            location: currentLocation,
            buttons: [
              {
                text: 'OK',
                styleType: 'danger',
                onPress: () => closePopup(),
              },
            ],
          });
        } else {
          closePopup();
        }
      })();
    }
  };

  useEffect(() => {
    if (pollingPaused) return;

    const fetchData = async () => {
      try {
        const res = await fetch(BACKEND_URL);

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log('Backend data:', data);

        if (data?.found) {
          const currentPassengers = Number(data.passenger_count ?? 0);
          const currentSeverity = normalizeSeverity(data.severity);
          const currentLocation = location.address || 'Unknown location';

          setPassengers(currentPassengers);
          setSeverity(currentSeverity);
          setLastUpdate(new Date());

          const incidentKey = `${currentSeverity}-${currentPassengers}-${currentLocation}`;

          if (
            ['LOW', 'MEDIUM', 'HIGH'].includes(currentSeverity) &&
            incidentKey !== lastHandledIncidentRef.current
          ) {
            lastHandledIncidentRef.current = incidentKey;
            showAccidentAlert(currentSeverity, currentPassengers, currentLocation);
          }

          if (currentSeverity === 'NO ACCIDENT') {
            lastHandledIncidentRef.current = '';
          }
        } else {
          setPassengers(0);
          setSeverity('NO DATA');
        }
      } catch (err) {
        console.log('Fetch error:', err);
        setPassengers(0);
        setSeverity('BACKEND OFFLINE');
      }
    };

    fetchData();
    const poll = setInterval(fetchData, 1000);

    return () => clearInterval(poll);
  }, [pollingPaused, location.address]);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  const isSafe = severity === 'NO ACCIDENT';
  const safeTitle = isSafe ? 'SAFE' : severity;
  const safeText =
    severity === 'BACKEND OFFLINE'
      ? 'Cannot connect to backend'
      : isSafe
      ? 'All systems normal'
      : severity === 'NO DATA'
      ? 'No vehicle data found'
      : 'Accident detected';

  const popupTheme = {
    LOW: {
      bg: '#fff7ed',
      iconBg: '#ffedd5',
      iconColor: '#f97316',
      buttonColor: '#f97316',
    },
    MEDIUM: {
      bg: '#fffbeb',
      iconBg: '#fef3c7',
      iconColor: '#eab308',
      buttonColor: '#eab308',
    },
    HIGH: {
      bg: '#fef2f2',
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      buttonColor: '#ef4444',
    },
  };

  const theme = popupTheme[popupType] || popupTheme.LOW;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>{formatTime(time)}</Text>
        <Text style={styles.logo}>ANZEN</Text>
        <Text style={styles.subHeader}>
          Vehicle: {VEHICLE_ID} | Driver: {DRIVER_NAME}
        </Text>
      </View>

      <View
        style={[
          styles.safeCard,
          !isSafe && severity !== 'LOADING...' && styles.dangerCard,
        ]}
      >
        <View
          style={[
            styles.iconCircleGreen,
            !isSafe && severity !== 'LOADING...' && styles.iconCircleRed,
          ]}
        >
          <Feather
            name="shield"
            size={24}
            color={
              isSafe
                ? '#22c55e'
                : severity === 'LOADING...'
                ? '#f59e0b'
                : '#ef4444'
            }
          />
        </View>

        <View>
          <Text
            style={[
              styles.safeTitle,
              !isSafe && severity !== 'LOADING...' && styles.dangerTitle,
            ]}
          >
            {safeTitle}
          </Text>
          <Text style={styles.safeText}>{safeText}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="people" size={24} color="#22c55e" />
            </View>
            <Text style={styles.cardTitle}>Detected Passengers</Text>
          </View>

          <View style={styles.countBoxGreen}>
            <Text style={styles.countText}>{passengers}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="location" size={24} color="#10b981" />
            </View>
            <Text style={styles.cardTitle}>Location Status</Text>
          </View>

          <TouchableOpacity
            onPress={() => setLocationEnabled(!locationEnabled)}
            style={[
              styles.toggle,
              locationEnabled ? styles.toggleOn : styles.toggleOff,
            ]}
          >
            <View
              style={[
                styles.dot,
                locationEnabled ? styles.dotOn : styles.dotOff,
              ]}
            />
            <Text
              style={[
                styles.toggleText,
                !locationEnabled && styles.toggleTextOff,
              ]}
            >
              {locationEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.locationText}>{location.address}</Text>

        {location.lat && location.lng && (
          <Text style={styles.coords}>
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Ionicons name="time" size={18} color="#6b7280" />
        <Text style={styles.footerText}>
          Last updated: {formatTime(lastUpdate)}
        </Text>
      </View>

      <Modal
        visible={popupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.bg }]}>
            <View style={[styles.modalIconWrap, { backgroundColor: theme.iconBg }]}>
              <MaterialCommunityIcons
                name={popupType === 'HIGH' ? 'alert-octagon' : 'car-emergency'}
                size={34}
                color={theme.iconColor}
              />
            </View>

            <Text style={styles.modalTitle}>{popupTitle}</Text>
            <Text style={styles.modalMessage}>{popupMessage}</Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Ionicons name="warning-outline" size={18} color="#475569" />
                <Text style={styles.infoText}>Severity: {popupType}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={18} color="#475569" />
                <Text style={styles.infoText}>Passengers: {popupPassengers}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#475569" />
                <Text style={styles.infoText}>{popupLocation}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              {popupButtons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    btn.styleType === 'secondary'
                      ? styles.modalButtonSecondary
                      : btn.styleType === 'danger'
                      ? [styles.modalButtonPrimary, { backgroundColor: '#ef4444' }]
                      : [styles.modalButtonPrimary, { backgroundColor: theme.buttonColor }],
                  ]}
                  onPress={btn.onPress}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      btn.styleType === 'secondary' && styles.modalButtonTextSecondary,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#0f172a',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  time: {
    color: '#cbd5e1',
    marginBottom: 10,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    color: '#cbd5e1',
    marginTop: 6,
  },
  safeCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerCard: {
    borderColor: '#ef4444',
  },
  iconCircleGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleRed: {
    backgroundColor: '#fee2e2',
  },
  safeTitle: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dangerTitle: {
    color: '#ef4444',
  },
  safeText: {
    color: '#4b5563',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  countBoxGreen: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  countText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleOn: {
    backgroundColor: '#0f172a',
  },
  toggleOff: {
    backgroundColor: '#e5e7eb',
  },
  toggleText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  toggleTextOff: {
    color: '#374151',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: '#22c55e',
  },
  dotOff: {
    backgroundColor: '#9ca3af',
  },
  locationText: {
    marginTop: 10,
    color: '#374151',
  },
  coords: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#6b7280',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    color: '#334155',
    fontSize: 14,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#f97316',
  },
  modalButtonSecondary: {
    backgroundColor: '#e2e8f0',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  modalButtonTextSecondary: {
    color: '#334155',
  },
});