import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ProfileBottomBar from '../src/components/ProfileBottomBar';


const placeholderLogs = [
  { date: '2025-04-25', description: 'Fertilized with a balanced fertilizer.' },
  { date: '2025-04-18', description: 'Repotted into a larger container.' },
  { date: '2025-04-10', description: 'Checked for pests and found none.' },
  { date: '2025-04-01', description: 'Pruned dead leaves.' },
];

export default function PlantLogsScreen() {
  const { id } = useLocalSearchParams();
  const plantID = parseInt(id as string);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Logs:</Text>
      <ScrollView style={styles.logsContainer}>
        {placeholderLogs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.logDate}>{log.date}</Text>
            <Text style={styles.logDescription}>{log.description}</Text>
          </View>
        ))}
      </ScrollView>
      <ProfileBottomBar plantID={plantID} activeRoute="logs" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1B5E20', // Dark green text
  },
  logsContainer: {
    paddingHorizontal: 20,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32', // Green date
    marginBottom: 5,
  },
  logDescription: {
    fontSize: 16,
    color: '#333',
  },
});