// Functions to interact with SQLite database
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db = SQLite.openDatabaseAsync('../species.db');

export const getDatabase = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('../species.db');
  return db;
};

export const setupDatabase = async () => {
  try {
    const db = await getDatabase();


    // Log the database path to see where it's being stored
    console.log("Database path:", db._name || db.name || "Unknown");


    // Check if tables exists
    const tableCheck = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='species';"
      );
      console.log("Table exists check:", tableCheck);


    // Create tables if they doesn't exist
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS species (
        speciesID INTEGER NOT NULL PRIMARY KEY,
        commonName TEXT NOT NULL,
        family TEXT NOT NULL,
        indoor INT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS plants (
       plantID INTEGER NOT NULL PRIMARY KEY,
       speciesID INTEGER NOT NULL,
       Nickname TEXT NOT NULL,
       indoor INT NOT NULL,
       dateAcquired TEXT NULL,
       location TEXT NULL, 
       lastWatered TEXT NULL,
       FOREIGN KEY (speciesID) REFERENCES species(speciesID)
      );
      CREATE TABLE IF NOT EXISTS locations (
        locationsID INTEGER NOT NULL PRIMARY KEY,
        locationName TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS plant_Images (
        imageID INTEGER NOT NULL PRIMARY KEY,
        plantID INTEGER NOT NULL,
        image TEXT NOT NULL,
        FOREIGN KEY (plantID) REFERENCES plants(plantID) ON DELETE CASCADE
      );
    `);
   
    // Check if data exists in species before inserting
    const countSpeciesResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM species`);
    console.log("Existing record count:", countSpeciesResult.count)
    if (countSpeciesResult.count === 0) {
      console.log("No records found, inserting initial data");
      await db.execAsync(`
        INSERT INTO species (commonName, family, indoor) VALUES ('Snake Plant', 'Asparagaceae', 1);
        INSERT INTO species (commonName, family, indoor) VALUES ('Hosta', 'Asparagaceae', 0);
        INSERT INTO species (commonName, family, indoor) VALUES ('Boston Fern', 'Nephrolepidaceae', 1);
      `);
     
      const afterInsertCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM species;");
      console.log("After insert count:", afterInsertCount.count);
    } else {
      console.log("Records already exist, skipping initial insert");
    } 

     // Check if data exists in plants before inserting
    const countPlantResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM plants`);
    console.log("Existing record count:", countPlantResult.count)
    if (countPlantResult.count === 0) {
      console.log("No records found, inserting initial data");
      await db.execAsync(`
        INSERT INTO plants (Nickname, speciesID, indoor) VALUES ('Patrick', 1, 1);
        INSERT INTO plants (Nickname, speciesID, indoor) VALUES ('Lucy', 2, 0);
        INSERT INTO plants (Nickname, speciesID, indoor) VALUES ('Fernise', 3, 1);
      `);
     
      const afterInsertPlantCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM plants;");
      console.log("After insert count:", afterInsertPlantCount.count);
    } else {
      console.log("Records already exist, skipping initial insert");
    }   
   
    // Check if data exists in locations before inserting
    const countLocationResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM locations`);
    console.log("Existing record count:", countLocationResult.count)
    if (countLocationResult.count === 0) {
      console.log("No records found, inserting initial data");
      await db.execAsync(`
        INSERT INTO locations (locationName) VALUES ('Living Room');
        INSERT INTO locations (locationName) VALUES ('Bedroom');
        INSERT INTO locations (locationName) VALUES ('Kitchen');
      `);
     
      const afterInsertLocationCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM locations;");
      console.log("After insert count:", afterInsertLocationCount.count);
    }
    else {  
      console.log("Records already exist, skipping initial insert");
    } 
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    return false;
  }
};

export const getIndoorSpecies = async () => {
  try {
    const db = await getDatabase();
    const results = await db.getAllAsync('SELECT * FROM species WHERE indoor = 1');
    console.log("Indoor species results:", results);
    return results || [];
  } catch (error) {
    console.error('Error fetching indoor species:', error);
    return [];
  }
};

export const getIndoorPlants = async () => {
  try {
    const db = await getDatabase();
    
    // Join plants with species to get the common name
    const plants = await db.getAllAsync(`
      SELECT 
        plants.plantID as id, 
        plants.Nickname, 
        plants.speciesID, 
        plants.indoor,
        species.commonName,
        species.family
      FROM plants
      JOIN species ON plants.speciesID = species.speciesID
      WHERE plants.indoor = 1
      ORDER BY plants.plantID
    `);
    
    console.log('Fetched indoor plants:', plants);
    return plants.map((plant: { id: any; Nickname: any; speciesID: any; indoor: any; commonName: any; family: any; }) => ({
      id: plant.id,
      Nickname: plant.Nickname,
      speciesID: plant.speciesID,
      indoor: plant.indoor,
      species: {
        commonName: plant.commonName,
        family: plant.family
      }
    }));
  } catch (error) {
    console.error('Error fetching indoor plants:', error);
    return [];
  }
};

export const getOutdoorSpecies = async () => {
    try {
      const db = await getDatabase();
      const results = await db.getAllAsync('SELECT * FROM species WHERE indoor = 0');
      console.log("Outdoor species results:", results);
      return results || [];
    } catch (error) {
      console.error('Error fetching outdoor species:', error);
      return [];
    }
};

export const getOutdoorPlants = async () => {
  try {
    const db = await getDatabase();
    
    // Join plants with species to get the common name
    const plants = await db.getAllAsync(`
      SELECT 
        plants.plantID as id, 
        plants.Nickname, 
        plants.speciesID, 
        plants.indoor,
        species.commonName,
        species.family
      FROM plants
      JOIN species ON plants.speciesID = species.speciesID
      WHERE plants.indoor = 0
      ORDER BY plants.plantID
    `);
    
    console.log('Fetched outdoor plants:', plants);
    return plants.map((plant: { id: any; Nickname: any; speciesID: any; indoor: any; commonName: any; family: any; }) => ({
      id: plant.id,
      Nickname: plant.Nickname,
      speciesID: plant.speciesID,
      indoor: plant.indoor,
      species: {
        commonName: plant.commonName,
        family: plant.family
      }
    }));
  } catch (error) {
    console.error('Error fetching outdoor plants:', error);
    return [];
  }
};

export const getAllSpecies = async () => {
  try {
    const db = await getDatabase();
    const results = await db.getAllAsync('SELECT * FROM species');
    return results;
  } catch (error) {
    console.error('Error fetching species:', error);
    return [];
  }
};

export const getAllPlants = async () => {
  try {
    const db = await getDatabase();
    const results = await db.getAllAsync('SELECT * FROM plants');
    return results;
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};

export const addSpecies = async (commonName : string, family : string, indoor : number) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO species (commonName, family, indoor) VALUES (?, ?, ?)',
      [commonName, family, indoor ? 1 : 0]
    );
    return true;
  } catch (error) {
    console.error('Error adding species:', error);
    return false;
  }
};

export const addPlant = async (Nickname : string, speciesID : number , indoor : number) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO plants (Nickname, speciesID, indoor) VALUES (?, ?, ?)',
      [Nickname, speciesID, indoor ? 1 : 0]
    );
    return true;
  } catch (error) {
    console.error('Error adding plants:', error);
    return false;
  }
};

// export const deleteSpecies = async (id) => {
//   try {
//     const db = await getDatabase();
//     await db.runAsync('DELETE FROM species WHERE id = ?', [id]);
//     return true;
//   } catch (error) {
//     console.error('Error deleting species:', error);
//     return false;
//   }
//};

// export const deletePlants = async (id) => {
//   try {
//     const db = await getDatabase();
//     await db.runAsync('DELETE FROM plants WHERE id = ?', [id]);
//     return true;
//   } catch (error) {
//     console.error('Error deleting plants:', error);
//     return false;
//   }
//};