import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from 'react';
import { getDatabase } from '../../dbFuncs';

const LocationDropdown = ({ onLocationSelect }: { onLocationSelect: (locationId: number) => void }) => {
    const [locationList, setLocationList] = useState<{ label: string; value: number }[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Fetch location data from the database
      const fetchLocations = async () => {
        try {
          setIsLoading(true);
          
          const db = await getDatabase();
          
          //Checking if database is empty
          console.log('Database object:', db);

          // Use getAllAsync to fetch locations
          const locations = await db.getAllAsync('SELECT locationsID, locationName FROM locations ORDER BY locationName ASC');
          console.log('Raw location query results:', locations);

          // Transform location data for dropdown
            const locationData: { label: string; value: number }[] = 
              locations.map((locations: { locationID: number; locationName: string }) => ({
              label: locations.locationName,
              value: locations.locationID
              }));
            console.log('Transformed location data:', locationData);
          
          setLocationList(locationData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching locations:', error);
          setIsLoading(false);
        }
      };
  
      fetchLocations();
    }, []); 
    
    interface LocationItem {
      label: string;
      value: number;
    }

    const handleLocationChange = (item: LocationItem): void => {
      setSelectedLocation(item.value);
      onLocationSelect(item.value);
    };

    if (isLoading) {
      return <Text>Loading locations...</Text>;
    }
    
      return (
        <View style={styles.container}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={locationList}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a plant location"
            searchPlaceholder="Search locations..."
            value={selectedLocation}
            onChange={handleLocationChange}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        padding: 16,
        width: '100%',
      },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      placeholderStyle: {
        fontSize: 16,
        color: 'gray',
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
    });

export default LocationDropdown;
