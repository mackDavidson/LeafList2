import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addLocation } from './dbFuncs';
import { useState } from 'react';
import { useRouter } from "expo-router";

export default function AddLocationPop() {
    const router = useRouter();
   
    const [locationName, setLocationName] = useState('');
    const [isIndoor, setIsIndoor] = useState(true); 
   
    const handleAddLocation = async () => {
        // Validate inputs
        if (!locationName.trim()) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }
       
        try {
            // Adding species to the database
            const success = await addLocation(
                locationName.trim(),
                isIndoor ? 1 : 0
            );
           
            if (success) {
                // Show success message
                Alert.alert(
                    "Success",
                    `${locationName} added successfully!`,
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else {
                Alert.alert("Error", "Failed to add species. Please try again.");
            }
        } catch (error) {
            console.error("Error adding species:", error);
            Alert.alert("Error", "Failed to add species. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Species</Text>
           
            {/* Location Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Location Name:</Text>
                <TextInput
                    style={styles.input}
                    value={locationName}
                    onChangeText={setLocationName}
                    placeholder="e.g., Living Room Window"
                    placeholderTextColor="#888"
                />
            </View>
           
            {/* Indoor or Outdoor */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Location Type:</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            isIndoor && styles.toggleButtonActive
                        ]}
                        onPress={() => setIsIndoor(true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            isIndoor && styles.toggleTextActive
                        ]}>Indoor</Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            !isIndoor && styles.toggleButtonActive
                        ]}
                        onPress={() => setIsIndoor(false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            !isIndoor && styles.toggleTextActive
                        ]}>Outdoor</Text>
                    </TouchableOpacity>
                </View>
            </View>
           
            {/* Add Button */}
            <TouchableOpacity
                style={styles.customBtn}
                onPress={handleAddLocation}
            >
                <Text style={styles.customBtnText}>Add Location</Text>
            </TouchableOpacity>
           
            {/* Cancel Button */}
            <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
            >
                <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5DC', // Light beige for a natural look
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32', // Deep green
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
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
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#4CAF50',
    },
    toggleText: {
        fontSize: 16,
        color: '#4CAF50',
    },
    toggleTextActive: {
        color: '#FFFFFF',
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