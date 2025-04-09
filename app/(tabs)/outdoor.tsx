import {useState, useEffect, useCallback} from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { setupDatabase, getOutdoorPlants } from '../dbFuncs';
import { useRouter, useFocusEffect } from "expo-router";

export default function outdoor() {
  type Species = {
    commonName: string;
    family: string;
  };

  type Plant = {
    plantID: number;
    Nickname: string;
    speciesID: number;
    indoor: number;
    species: Species;
  };
   
  const router = useRouter();
  const [species, setSpecies] = useState<Species[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
   
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await setupDatabase();
      const data = await getOutdoorPlants();
      console.log("Outdoor Plants:", data);
      setPlants(data);
    } catch (error) {
      console.error("Database error:", error);
      Alert.alert('Error', 'Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);
   
  useEffect(() => {
    loadData();
  }, []);
   
  // Reload data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Outdoor screen in focus - reloading data");
      loadData();
      return () => {
        // Optional cleanup if needed
      };
    }, [loadData])
  );
   
  // function to handle navigating to plant profile
  const navigateToPlantProfile = (plantID: number) => {
    // Navigate to the plant profile screen with the species ID
    router.push(`/plantProfile/${plantID}`);
  };

  if (loading) {
    return <View style={styles.container}><Text>Loading database...</Text></View>;
  }
     
  return (
    <View style={styles.container}>
        <Text style={styles.header}>Outdoor Plants</Text>
        <TouchableOpacity style={styles.customBtn}
         onPress={() => router.push("../addPlantPop")}>
          <Text style={styles.customBtnText}>Add Plant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customBtn}
         onPress={() => router.push("../addSpeciesPop")}>
          <Text style={styles.customBtnText}>Add Species</Text>
        </TouchableOpacity>
          <FlatList
            style={styles.plantList}
            data={plants}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.plantItem} 
                onPress={() => navigateToPlantProfile} 
                >
                <Text style={styles.plantText}>{item.Nickname}</Text>
                <Text style={styles.plantText}>{item.species.commonName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.plantID?.toString() || Math.random().toString()} 
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No outdoor plants found</Text>
              </View>
            }
          />
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
      marginBottom: 16,
    },
    plantList: {
      flexGrow: 1,
    },
    plantItem: {
      backgroundColor: '#A5D6A7', // Soft green
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    plantText: {
      fontSize: 15,
      padding: 7,
      color: '#1B5E20', // Darker green for contrast
      flex: 1,
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
      marginVertical: 12,
    },
    customBtnText: {
      fontSize: 18,
      color: '#FFFFFF', // White for contrast
      fontWeight: 'bold',
    },
    emptyList: {
      alignItems: 'center',
      padding: 20,
      marginTop: 30,
    },
    emptyText: {
      fontSize: 18,
      color: '#777',
      fontStyle: 'italic',
    },
  });
