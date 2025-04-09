import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addSpecies } from './dbFuncs';
import { useState } from 'react';
import { useRouter } from "expo-router";


export default function AddSpeciesPop() {
    const router = useRouter();
   
    // State for form inputs
    const [commonName, setCommonName] = useState('');
    const [family, setFamily] = useState('');
    const [isIndoor, setIsIndoor] = useState(true); // Default to indoor
   
    const handleAddSpecies = async () => {
        // Validate inputs
        if (!commonName.trim() || !family.trim()) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }
       
        try {
            // Call the addSpecies function with individual parameters
            // This matches your dbFuncs.ts implementation
            const success = await addSpecies(
                commonName.trim(),
                family.trim(),
                isIndoor ? 1 : 0
            );
           
            if (success) {
                // Show success message
                Alert.alert(
                    "Success",
                    `${commonName} added successfully!`,
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
           
            {/* Common Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Common Name:</Text>
                <TextInput
                    style={styles.input}
                    value={commonName}
                    onChangeText={setCommonName}
                    placeholder="e.g., Snake Plant"
                    placeholderTextColor="#888"
                />
            </View>
           
            {/* Family Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Family:</Text>
                <TextInput
                    style={styles.input}
                    value={family}
                    onChangeText={setFamily}
                    placeholder="e.g., Asparagaceae"
                    placeholderTextColor="#888"
                />
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
                onPress={handleAddSpecies}
            >
                <Text style={styles.customBtnText}>Add Species</Text>
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
