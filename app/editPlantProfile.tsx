import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { updatePlant } from './dbFuncs';
import LocationDropdown from './src/components/LocationDropdown'; 
import SpeciesDropdown from './src/components/SpeciesDropdown'; 

export default function editPlantProfile() {
  const router = useRouter();
  const { plantID, initialData } = useLocalSearchParams();
  const plant = initialData ? JSON.parse(initialData as string) : null;

  // Initialize state with plant data
  const [nickname, setNickname] = useState(plant ? plant.Nickname : '');
  const [lastWatered, setLastWatered] = useState(plant ? plant.lastWatered : null);
  const [soilType, setSoilType] = useState(plant ? 'Peat-based Potting Mix' : ''); 
  const [temperature, setTemperature] = useState(plant ? '60-75°F (15-24°C)' : '');
  const [sunlightPreferences, setSunlightPreferences] = useState(plant ? 'Indirect, Bright Light' : ''); 
  const [locationID, setLocationID] = useState(plant ? plant.locationID : null);
  const [speciesID, setSpeciesID] = useState(plant? plant.speciesID : null);

  useEffect(() => {
    if (plant) {
      setNickname(plant.Nickname);
      setSoilType('Peat-based Potting Mix'); 
      setTemperature('60-75°F (15-24°C)'); 
      setSunlightPreferences('Indirect, Bright Light'); 
      setLocationID(plant.locationID);
      setSpeciesID(plant.speciesID);
      setLastWatered(plant.lastWatered);
    }
  }, []);

  const handleUpdate = async () => {
    try {
      // Gather the updated values
      const updatedPlantData = {
        plantID: plant.plantID,
        Nickname: nickname,
        lastWatered: lastWatered,
        soilType: soilType,
        temperature: temperature,
        sunlightPreferences: sunlightPreferences,
        locationID: locationID,
        speciesID: speciesID,
      };
  
      // Call the updatePlant function
      await updatePlant(updatedPlantData);
  
      // Navigate back to the plant profile screen
      router.push('/(tabs)'); 
      router.push(`/profiles/${plantID}`);
    } catch (error) {
      console.error('Error updating plant:', error);
      Alert.alert('Error', 'Failed to update plant data. Please try again.');
    }
  };

 return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>

        {/* Profile Picture Section */}
        
        
        {/* Details Section */}
        <View style={styles.detailsSection}>

          {/* Nickname */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Nickname</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <TextInput
                style={styles.detailValue}
                value={nickname}
                onChangeText={(text) => {
                  console.log('Nickname changed to:', text);
                  setNickname(text);
                }}
              />
            </View>
          </View>

          {/* Species */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Species</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <SpeciesDropdown
                onSpeciesSelect={(speciesId: number) => setSpeciesID(speciesId)}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Location</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <LocationDropdown
                onLocationSelect={(locationId: number) => setLocationID(locationId)}
                />
            </View>
          </View>
            
            {/* Last Watered */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Last Watered</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <TextInput
                style={styles.detailValue}
                value={lastWatered}
                onChangeText={(text) => setLastWatered(text)}
              />
            </View>
          </View>

          {/* Soil Type */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Soil Type</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <TextInput
                style={styles.detailValue}
                value={soilType}
                onChangeText={setSoilType}
              />
            </View>
          </View>

          {/* Temperature */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Temperature</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <TextInput
                style={styles.detailValue}
                value={temperature}
                onChangeText={setTemperature}
              />
            </View>
          </View>

          {/* Sunlight Preferences */}
          <View style={styles.detailContainer}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Sunlight Preferences</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <TextInput
                style={styles.detailValue}
                value={sunlightPreferences}
                onChangeText={setSunlightPreferences}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Plant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#2E7D32',
    marginTop: 10,
    fontSize: 16,
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  detailContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  detailValue: {
    fontSize: 16,
    color: '#2E7D32',
  },
  detailValueContainer: {
    minHeight: 30,
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});