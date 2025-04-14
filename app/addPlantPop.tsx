import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addPlant } from './dbFuncs';
import { useState, } from 'react';
import { useRouter } from "expo-router";
import SpeciesDropdown from './src/components/SpeciesDropdown'
import LocationDropdown from './src/components/LocationDropdown';


export default function AddPlantPop() {
    const router = useRouter();
   
    // State for form inputs
    const [Nickname, setNickname] = useState('');
    const [speciesID, setSpeciesID] = useState(0);
    const [locationID, setLocationID] = useState(0);
    const [isIndoor, setIsIndoor] = useState(true); // Default to indoor

    const handleSpeciesSelect = (speciesID: number): void => {
        // Update the species ID state when a species is selected
        setSpeciesID(speciesID);
        console.log('Selected Species ID:', speciesID);
    };

    const handleLocationSelect = (locationID: number): void => {
        // Update the location ID state when a location is selected
        setLocationID(locationID);
        console.log('Selected Location ID:', locationID);
    };
   
    const handleAddPlant = async () => {
        // Validate inputs
        if (!Nickname.trim() || speciesID===0 || locationID===0) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }
       
        try {
            // Call the addPlants function with individual parameters
            const success = await addPlant(
                Nickname.trim(),
                speciesID,
                isIndoor ? 1 : 0,
                locationID
            );
           
            if (success) {
                // Show success message
                Alert.alert(
                    "Success",
                    `${Nickname} added successfully!`,
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else {
                Alert.alert("Error", "Failed to add plant. Please try again.");
            }
        } catch (error) {
            console.error("Error adding plant:", error);
            Alert.alert("Error", "Failed to add plant. Please try again.");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Plant</Text>
           
            {/* Nickname Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nickname:</Text>
                <TextInput
                    style={styles.input}
                    value={Nickname}
                    onChangeText={setNickname}
                    placeholder="e.g., Glenn"
                    placeholderTextColor="#888"
                />
            </View>
           
            {/* Species Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Species:</Text>
                <SpeciesDropdown onSpeciesSelect={handleSpeciesSelect} />
            </View>
            
            {/* Location Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Location:</Text>
                <LocationDropdown onLocationSelect={handleLocationSelect} />
            </View>
           
            {/* Indoor/Outdoor Selection */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Plant Type:</Text>
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
                onPress={handleAddPlant}
            >
                <Text style={styles.customBtnText}>Add Plant</Text>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
      },
    picker: {
        height: 50,
        width: '100%',
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
