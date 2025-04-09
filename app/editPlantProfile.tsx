import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function editPlantProfile() {
  const router = useRouter();

 return (
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
            <Text style={styles.detailValue}>My Lovely Fern</Text>
          </View>
        </View>

        {/* Species */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Species</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Boston Fern</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Location</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Living Room Window</Text>
          </View>
        </View>

        {/* Soil Type */}
        <View style={styles.detailContainer}>
          <View style={styles.detailLabelContainer}>
            <Text style={styles.detailLabel}>Soil Type</Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValue}>Peat-based Potting Mix</Text>
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
    </ScrollView>
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
});