import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ProfileBottomBar from '../src/components/ProfileBottomBar';


export default function PlantGalleryScreen() {
 
 const { id } = useLocalSearchParams<{ id: string }>();
 const plantID = parseInt(id);
 console.log('Profile page received ID: ', plantID);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Gallery (ID: {plantID})</Text>
      <Text style={styles.placeholderText}>No images available for this plant.</Text>
      <ProfileBottomBar plantID={plantID} activeRoute="gallery" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
    },
    galleryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10,
    },
    image: {
      width: 150,
      height: 150,
      margin: 5,
      borderRadius: 10,
    },
    placeholderText: {
      fontSize: 18,
      color: '#888',
    },
  });