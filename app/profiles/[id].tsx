import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlantById} from '../dbFuncs';
import ProfileBottomBar from '../src/components/ProfileBottomBar';

export default function PlantProfileScreen() {
  type Plant = {
    plantID: number;
    Nickname: string;
    speciesID: number;
    indoor: number;
    speciesName: string;
    locationName: string;
    dateAcquired: string | null;
    lastWatered: string | null;
    lastFertilized: string | null;
  };

  const router = useRouter();

  // Get the plant ID from the URL parameters which is a string by default
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantID = parseInt(id);
  console.log('Profile page received ID: ', plantID);
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load plant data 
    async function loadPlantData() {
      try {
        setLoading(true);
        const plantData = await getPlantById(plantID);
        
        if (plantData && typeof plantData === 'object' && plantData.plantID === plantID) {
          setPlant(plantData as Plant);
        } else {
          Alert.alert('Error', 'Plant not found.' + error);
        }
      } catch (err) {
        console.error('Error loading plant:', err);
        Alert.alert('Error', 'Failed to load plant data: ' + error);
      } finally {
        setLoading(false);
      }
    }

    loadPlantData();
  }, [plantID]);

  const handleEdit = () => {
    console.log('Edit button pressed');
    if (plant) {
      console.log('Plant data available:', plant);
      router.push({
        pathname: '/editPlantProfile',
        params: { 
          plantID: plant.plantID,
          initialData: JSON.stringify(plant) // Pass plant data as a JSON string
        }
      });
    } else {
      Alert.alert('Error', 'Plant data not available for editing.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading plant information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Profile Picture Section */}
      <TouchableOpacity style={styles.profileImageContainer}>
        <View style={styles.profileImagePlaceholder}>
          <Feather name="camera" size={40} color="#2E7D32" />
          <Text style={styles.addPhotoText}>Add Plant Photo</Text>
        </View>
      </TouchableOpacity>
      
      {/* Details Section */}
      <View style={styles.detailsSection}>
        {/* Nickname */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Nickname</Text>
            <TouchableOpacity onPress={() => handleEdit()}>
              <Feather name="edit-2" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{plant?.Nickname || 'No Nickname'}</Text>
          </View>
        </View>

        {/* Species */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Species</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{plant?.speciesName || 'Not found'}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Location</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{plant?.locationName || 'Not Specified'}</Text>
          </View>
        </View>

        {/* Soil Type */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Soil Type</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Potting Mix</Text>
          </View>
        </View>

        {/* Temperature */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Temperature</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>60-75°F (15-24°C)</Text>
          </View>
        </View>

        {/* Sunlight Preferences */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Sunlight Preferences</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Indirect, Bright Light</Text>
          </View>
        </View>
      </View>
      <ProfileBottomBar plantID={plantID} activeRoute="profile" />
    </ScrollView>
  );
};

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
  linkText: {
    fontSize: 16,
    color: '#2E7D32',
    textDecorationLine: 'underline',
  },
});
