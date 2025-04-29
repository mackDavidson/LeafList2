import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';

type Plant = {
  plantID: number;
  Nickname: string;
  speciesName: string;
  locationName: string;
  indoor: number;
  dateAcquired: string | null;
  lastWatered: string | null;
  lastFertilized: string | null;
};

type PlantItemProps = {
  item: Plant;
};

const PlantItem: React.FC<PlantItemProps> = React.memo(({ item }) => {
  const router = useRouter();

  const navigateToPlantProfile = (plantID: number) => {
    console.log('Navigating to plant profile with ID:', plantID);
    router.push(`../profiles/${plantID}`);
  };

  return (
    <TouchableOpacity
      style={styles.plantItem}
      onPress={() => {
        if (item.plantID) {
          navigateToPlantProfile(item.plantID);
        } else {
          Alert.alert('Error', 'Plant ID is missing.');
        }
      }}
    >
      <View style={styles.plantContent}>
      <View style={styles.profileImagePlaceholder} />
        <Text style={styles.nicknameBadge}>{item.Nickname}</Text>
        <Text style={[styles.speciesName, { ellipsizeMode: 'tail', numberOfLines: 1 } as TextStyle]}>
          {item.speciesName || 'Unknown Species'}
        </Text>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  plantItem: {
    backgroundColor: '#A5D6A7', // Soft green
    borderRadius: 10,
    marginVertical: 0, 
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 0, // Reduce elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 }, // Reduce shadow offset
    shadowOpacity: 0.05, // Reduce shadow opacity
    shadowRadius: 0.5, // Reduce shadow radius
  },
  plantContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    height: 50,
  },
  profileImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A5D6A7',
    marginRight: 8,
    borderWidth: 1, 
    borderColor: '#2E7D32', 
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
});

export default PlantItem;