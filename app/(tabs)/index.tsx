import { useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getIndoorPlants, resetDatabase, cleanupDuplicatePlants, setupDatabase } from '../dbFuncs';
import { useRouter, useFocusEffect } from "expo-router";
import { FlashList } from '@shopify/flash-list';
import { SwipeListView } from 'react-native-swipe-list-view';
import PlantItem from '../src/components/PlantItem';

export default function indoor() {
    
  type Plant = {
    plantID: number;
    Nickname: string;
    speciesID: number;
    indoor: number;
    speciesName: string;
    locationName: string;
    logID: number | null;
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
      // Uncomment the next line if you want to set up the database 
      // setupDatabase();
      const data = await getIndoorPlants();
      console.log("Indoor plants:", data);
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
      console.log("Indoor screen in focus - reloading data");
      loadData();
    }, [loadData])
  );
  // Rendering custom plant item component
  const renderItem = useCallback(({ item }) => (
    <PlantItem item={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.plantID?.toString() || Math.random().toString(), []);

  if (loading) {
    return <View style={styles.container}><Text>Loading database...</Text></View>;
  }

  // ***WORK IN PROGRESS*** Beginning of swipe gesture function to delete a row/plant 
  // const deleteRow = async (rowMap, plantID) => {
  //   if (rowMap[plantID]) {
  //     rowMap[plantID].closeRow();
  //   }
  //   const newData = [...plants];
  //   const prevIndex = plants.findIndex(item => item.plantID === plantID);
  //   newData.splice(prevIndex, 1);
  //   setPlants(newData);
  //   // Delete from database
  //   try {
  //     setLoading(true);
  //     await deletePlant(plantID);
  //     Alert.alert('Success', 'Plant has been deleted');
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     Alert.alert('Error', 'Failed to delete plant');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const closeRow = (rowMap, plantID) => {
  //   if (rowMap[plantID]) {
  //     rowMap[plantID].closeRow();
  //   }
  // };

  // ***FUNCTION TO DELETE A ROW/PLANT - WORK IN PROGRESS***
  // const renderHiddenItem = useCallback(
  //   (data, rowMap) => (
  //     <View style={styles.rowBack}>
  //       <TouchableOpacity
  //         style={[styles.backRightBtn, styles.backRightBtnLeft]}
  //         onPress={() => closeRow(rowMap, data.item.plantID)}
  //       >
  //         <Text style={styles.backTextWhite}>Close</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={[styles.backRightBtn, styles.backRightBtnRight]}
  //         onPress={() => deleteRow(rowMap, data.item.plantID)}
  //       >
  //         <Text style={styles.backTextWhite}>Delete</Text>
  //       </TouchableOpacity>
  //     </View>
  //   ),
  //   []
  // );
 
  // const handleResetDatabase = async () => {
  //   try {
  //     const confirmed = await new Promise((resolve) => {
  //       Alert.alert(
  //         'Reset Database',
  //         'This will delete ALL data. Are you sure?',
  //         [
  //           { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
  //           { text: 'Reset', onPress: () => resolve(true), style: 'destructive' }
  //         ]
  //       );
  //     });
  
  //     if (confirmed) {
  //       setLoading(true);
  //       await resetDatabase();
  //       await loadData(); // Reload data after reset
  //       Alert.alert('Success', 'Database has been reset');
  //     }
  //   } catch (error) {
  //     console.error('Reset error:', error);
  //     Alert.alert('Error', 'Failed to reset database');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleCleanupDuplicates = async () => {
  //   try {
  //     setLoading(true);
  //     await cleanupDuplicatePlants();
  //     await loadData(); // Reload data after cleanup
  //     Alert.alert('Success', 'Duplicate plants have been removed');
  //   } catch (error) {
  //     console.error('Cleanup error:', error);
  //     Alert.alert('Error', 'Failed to clean up duplicates');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Indoor Plants</Text>
        
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
        {/* <SwipeListView ***MIGHT NOT BE NEEDED***
          style={styles.plantList}
          contentContainerStyle={styles.listContentContainer}
          data={plants}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No indoor plants found</Text>
            </View>
          }
          leftOpenValue={75}
          rightOpenValue={-75}
          disableRightSwipe={true}
        /> */}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Light beige
    padding: 14,
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
  dangerButton: {
    backgroundColor: '#d32f2f', // Red color for dangerous actions
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
    flex: 1,
  },
  listContentContainer: {
    paddingVertical: 0,
  },
  itemSeparator: {
    height: 2,
    backgroundColor: 'transparent',
  },
  plantItem: {
    backgroundColor: '#A5D6A7', // Soft green
    borderRadius: 8,
    marginVertical: 0, // Remove vertical margins
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
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
    height: 50,
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});