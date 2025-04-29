import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addPlantLog } from './dbFuncs'; 

export default function AddLogPop() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const plantID = parseInt(id as string);

  const [logDate, setLogDate] = useState(''); // Format: MM/DD/YYYY
  const [notes, setNotes] = useState('');

  const handleSaveLog = async () => {
    if (!logDate || !notes.trim()) {
      Alert.alert('Error', 'Please fill in both date and notes.');
      return;
    }

    try {
      const success = await addPlantLog(plantID, logDate, notes);
      if (success) {
        Alert.alert('Success', 'Log added successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', 'Failed to add log. Please try again.');
      }
    } catch (error) {
      console.error('Error adding log:', error);
      Alert.alert('Error', 'Failed to add log. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Log</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={logDate}
          onChangeText={setLogDate}
          placeholder="MM/DD/YYYY"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter your notes here"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.customBtn} onPress={handleSaveLog}>
        <Text style={styles.customBtnText}>Save Log</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32', // Deep green
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  customBtn: {
    backgroundColor: '#4CAF50', // Vibrant green
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginTop: 24,
  },
  customBtnText: {
    fontSize: 18,
    color: '#FFFFFF', // White for contrast
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginTop: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});