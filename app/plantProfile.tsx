import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDatabase } from './dbFuncs';

export default function PlantProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantID = Number(id);
  
  const [plant, setPlant] = useState<{ Nickname: string; Location?: string; Species: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load plant data 
    async function loadPlantData() {
      try {
        setLoading(true);
        const plantData = await getDatabase();
        
        if (plantData) {
          setPlant(plantData);
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
    // Navigate to edit screen with plant data
    router.push({
      pathname: '/editPlantProfile',
      params: { plantID, initialData: JSON.stringify(plant) }
    });
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
            <TouchableOpacity onPress={() => handleEdit}>
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
            <TouchableOpacity>
              <Feather name="edit-2" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{plant?.Species || 'Not found'}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Location</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>{plant?.Location || 'Not Specified'}</Text>
          </View>
        </View>

        {/* Soil Type */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Soil Type</Text>
            <TouchableOpacity>
              <Feather name="edit-2" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Peat-based Potting Mix</Text>
          </View>
        </View>

        {/* Temperature */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Temperature</Text>
            <TouchableOpacity>
              <Feather name="edit-2" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>60-75°F (15-24°C)</Text>
          </View>
        </View>

        {/* Sunlight Preferences */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Sunlight Preferences</Text>
            <TouchableOpacity>
              <Feather name="edit-2" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Indirect, Bright Light</Text>
          </View>
        </View>
      </View>
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
