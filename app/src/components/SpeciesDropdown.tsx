import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from 'react';
import { getDatabase } from '../../dbFuncs';

const SpeciesDropdown = ({ onSpeciesSelect }: { onSpeciesSelect: (speciesId: number) => void }) => {
    const [speciesList, setSpeciesList] = useState<{ label: string; value: number }[]>([]);
    const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Fetch species data from the database
      const fetchSpecies = async () => {
        try {
          setIsLoading(true);
          const db = await getDatabase();
          
          //Checking if database is empty
          console.log('Database object:', db);

          // Use getAllAsync to fetch species
          const species = await db.getAllAsync('SELECT speciesID, commonName FROM species ORDER BY commonName ASC');
          console.log('Raw species query results:', species);

          // Transform species data for dropdown
            const speciesData: { label: string; value: number }[] = 
              species.map((species: { speciesID: number; commonName: string }) => ({
              label: species.commonName,
              value: species.speciesID
              }));
            console.log('Transformed species data:', speciesData);
          
          setSpeciesList(speciesData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching species:', error);
          setIsLoading(false);
        }
      };
  
      fetchSpecies();
    }, []); // Empty dependency array means this runs once on component mount
    
    interface SpeciesItem {
      label: string;
      value: number;
    }

    const handleSpeciesChange = (item: SpeciesItem): void => {
      setSelectedSpecies(item.value);
      onSpeciesSelect(item.value);
    };

    if (isLoading) {
      return <Text>Loading species...</Text>;
    }
    
      return (
        <View style={styles.container}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={speciesList}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a plant species"
            searchPlaceholder="Search species..."
            value={selectedSpecies}
            onChange={handleSpeciesChange}
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

export default SpeciesDropdown;
