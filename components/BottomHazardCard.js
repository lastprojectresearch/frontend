import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { formatDistanceToNow, isValid } from 'date-fns';

export default function BottomHazardCard({ selectedHazard, onClose, calculateDistance, onAvoid }) {
  if (!selectedHazard) return null;

  const timeAgo = isValid(selectedHazard.timestamp)
    ? formatDistanceToNow(selectedHazard.timestamp) + ' ago'
    : 'Unknown time';

  const handleAvoidPress = () => {
    onAvoid(selectedHazard);
  };

  const handleIgnorePress = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.bottomCard}>
          <Text style={styles.cardTitle}>
            {selectedHazard.type.charAt(0).toUpperCase() + selectedHazard.type.slice(1)} Zone
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Distance: {calculateDistance(selectedHazard)}</Text>
            <Text style={styles.infoText}>Detected: {timeAgo}</Text>
          </View>
          <Image
            source={{ uri: selectedHazard.image }}
            style={styles.cardImage}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.ignoreButton} onPress={handleIgnorePress}>
              <Text style={styles.buttonText}>Ignore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avoidButton} onPress={handleAvoidPress}>
              <Text style={styles.buttonText}>Avoid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  bottomCard: {
    backgroundColor: '#1E293B', // Secondary: Slate Blue
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { 
    color: '#EF4444', // Danger: Red
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  infoText: {
    color: '#F8FAFC', // Light text for contrast
    fontSize: 16,
  },
  cardImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  ignoreButton: { 
    backgroundColor: '#0F172A', // Primary: Deep Navy
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  avoidButton: { 
    backgroundColor: '#22C55E', // Accent: Green
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: { 
    color: '#F8FAFC', // Light text
    fontWeight: 'bold',
    fontSize: 16,
  },
});