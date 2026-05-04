import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Alert, Image } from 'react-native';
import { formatDistanceToNow, isValid, format } from 'date-fns';

/* IMAGE IMPORTS */

const policeImages = [
  require('../assets/police1.jpg'),
  require('../assets/police2.jpg'),
  require('../assets/police3.jpg'),
];

const constructionImages = [
  require('../assets/construction1.jpg'),
  require('../assets/construction2.jpg'),
  require('../assets/construction3.jpg'),
];

const potholeImages = [
  require('../assets/pothole1.jpg'),
  require('../assets/pothole2.jpg'),
  require('../assets/pothole3.jpg'),
];

export default function BottomHazardCard({ selectedHazard, onClose, calculateDistance, onVote }) {

  const [hazardImage, setHazardImage] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!selectedHazard) return;

    const pickImage = () => {
      let arr = [];

      if (selectedHazard.type === 'police') arr = policeImages;
      if (selectedHazard.type === 'construction') arr = constructionImages;
      if (selectedHazard.type === 'pothole') arr = potholeImages;

      setHazardImage(arr[Math.floor(Math.random() * arr.length)]);
    };

    pickImage();

    const expDate = new Date(selectedHazard.expiration);
    const now = new Date();
    setExpired(expDate <= now);

  }, [selectedHazard]);

  if (!selectedHazard) return null;

  const identifiedTime = isValid(selectedHazard.timestamp)
    ? format(selectedHazard.timestamp, 'PPPpp')
    : 'Unknown';

  const expirationTime = isValid(selectedHazard.expiration)
    ? format(selectedHazard.expiration, 'PPPpp')
    : 'Unknown';

  const handleAccept = () => {
    const distKm = parseFloat(calculateDistance(selectedHazard));
    if (distKm > 2) {
      Alert.alert('Out of Range', 'You must be within 2 km to vote.');
      return;
    }
    onVote(selectedHazard.id, 'accept');
  };

  const handleReject = () => {
    const distKm = parseFloat(calculateDistance(selectedHazard));
    if (distKm > 2) {
      Alert.alert('Out of Range', 'You must be within 2 km to vote.');
      return;
    }
    onVote(selectedHazard.id, 'reject');
  };

  return (
    <Modal animationType="slide" transparent visible={!!selectedHazard} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.card, expired && styles.expiredCard]}>

          {/* IMAGE CONTAINER */}
          {hazardImage && (
            <View style={styles.imageContainer}>
              <Image source={hazardImage} style={styles.hazardImage} />
            </View>
          )}

          <Text style={[styles.title, expired && styles.expiredText]}>
            {selectedHazard.type.toUpperCase()} HAZARD
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Distance: {calculateDistance(selectedHazard)} km</Text>
            <Text style={styles.infoText}>Identified: {identifiedTime}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infoText}>Expires: {expirationTime}</Text>
              {expired && <Text style={styles.expiredLabel}> (Expired)</Text>}
            </View>
          </View>

          <View style={styles.votesRow}>
            <Text style={styles.voteText}>Accepts: {selectedHazard.accept_count}</Text>
            <Text style={styles.voteText}>Rejects: {selectedHazard.reject_count}</Text>
          </View>

          {!expired && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay:{
    flex:1,
    justifyContent:'flex-end',
    backgroundColor:'rgba(0,0,0,0.5)'
  },

  card:{
    backgroundColor:'#1E293B',
    padding:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    alignItems:'center'
  },

  expiredCard:{
    backgroundColor:'#374151'
  },

  /* IMAGE FIX */

  imageContainer:{
    width:90,
    height:90,
    backgroundColor:'#0F172A',
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
    padding:10
  },

  hazardImage:{
    width:60,
    height:60,
    resizeMode:'contain'
  },

  title:{
    color:'#EF4444',
    fontSize:20,
    fontWeight:'bold',
    marginBottom:10
  },

  expiredText:{
    color:'#9CA3AF'
  },

  infoRow:{
    width:'100%',
    marginBottom:10
  },

  infoText:{
    color:'#F8FAFC',
    fontSize:15,
    marginBottom:3
  },

  votesRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    marginBottom:10
  },

  voteText:{
    color:'#F8FAFC',
    fontWeight:'bold'
  },

  buttonRow:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    width:'100%'
  },

  acceptButton:{
    backgroundColor:'#22C55E',
    paddingVertical:10,
    paddingHorizontal:30,
    borderRadius:20
  },

  rejectButton:{
    backgroundColor:'#EF4444',
    paddingVertical:10,
    paddingHorizontal:30,
    borderRadius:20
  },

  buttonText:{
    color:'#F8FAFC',
    fontWeight:'bold'
  },

  expiredLabel: {
    color: '#FF0000',
    fontSize: 15,
    marginLeft: 5
  }

});