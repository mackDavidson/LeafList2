import {useState, useCallback} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getOutdoorPlants } from '../dbFuncs';
import { useRouter, useFocusEffect } from "expo-router";
import PlantItem from '../src/components/PlantItem';
import { FlashList } from '@shopify/flash-list';

export default function outdoor() {

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
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
   
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOutdoorPlants();
      console.log("Outdoor Plants:", data);
      setPlants(data);
    } catch (error) {
      console.error("Database error:", error);
      Alert.alert('Error', 'Failed to load data: ' + error);
    } finally {
      setLoading(false);
    }
  }, []);
   
  // Reload data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Outdoor screen in focus - reloading data");
      loadData();
    }, [loadData])
  );
   
  const renderItem = useCallback(({ item }) => (
    <PlantItem item={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.plantID?.toString() || Math.random().toString(), []);

  if (loading) {
    return <View style={styles.container}><Text>Loading database...</Text></View>;
  }
     
return (
    <View style={styles.container}>
        <Text style={styles.header}>Outdoor Plants</Text>
        
        {/* Button Panel */}
        <View style={styles.buttonPanel}>
          <TouchableOpacity 
            style={styles.panelButton}
            onPress={() => router.push("../addPlantPop")}>
            <Text style={styles.panelButtonText}>Add Plant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.panelButton}
            onPress={() => router.push("../addSpeciesPop")}>
            <Text style={styles.panelButtonText}>Add Species</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.panelButton}
            onPress={() => router.push("../addLocationPop")}>
            <Text style={styles.panelButtonText}>Add Location</Text>
          </TouchableOpacity>
        </View>
        
        <FlashList
          style={styles.plantList}
          contentContainerStyle={styles.listContentContainer}
          data={plants}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No indoor plants found</Text>
            </View>
          }
        />
    </View>
  );
}
   
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Light beige 
    padding: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32', // Deep green
    textAlign: 'center',
    marginBottom: 14,
  },
  // Button Panel Styles
  buttonPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: 'rgba(165, 214, 167, 0.3)', // Light green with transparency
    borderRadius: 10,
    padding: 6,
  },
  panelButton: {
    flex: 1,
    backgroundColor: '#4CAF50', // Vibrant green
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  panelButtonText: {
    fontSize: 14,
    color: '#FFFFFF', // White 
    fontWeight: 'bold',
  },
  plantList: {
    flexGrow: 1,
  },
  listContentContainer: {
    paddingVertical: 0, 
  },
  itemSeparator: {
    height: 2, // Explicit spacing in pixels
    backgroundColor: 'transparent', 
  },
  plantItem: {
    backgroundColor: '#A5D6A7', // Soft green
    borderRadius: 8,
    marginVertical: 0, // Remove vertical margins
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    // Reduce shadow/elevation for less visual space
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  plantContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  nicknameBadge: {
    backgroundColor: '#2E7D32', // Darker green
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 12,
    fontSize: 16,
    overflow: 'hidden',
  },
  speciesName: {
    fontSize: 16,
    color: '#1B5E20', // Dark green
    fontStyle: 'italic',
    flex: 1,
  },
  chevron: {
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(46, 125, 50, 0.2)', // Semi-transparent green
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 22,
    color: '#2E7D32',
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
