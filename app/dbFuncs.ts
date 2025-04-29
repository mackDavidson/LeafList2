// Functions to interact with SQLite database
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const dbName = 'leaflist.db'; 
let db : SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync(dbName);
  }
    return db;
};

export const setupDatabase = async () => {
  try {
    const db = await getDatabase();

    // Check if tables exists
    const existingTables = await db.getAllAsync(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);
    console.log('Existing tables:', existingTables.map(t => t.name));

      // await db.execAsync(`
      //   PRAGMA foreign_keys = OFF;       
      //   DROP TABLE IF EXISTS plants;
      //   DROP TABLE IF EXISTS plantLogs;
      //   DROP TABLE IF EXISTS plantImages;
      //   DROP TABLE IF EXISTS species;
      //   DROP TABLE IF EXISTS locations;
      //   PRAGMA foreign_keys = ON;
      // `);

      // console.log('Existing tables:', existingTables.map(t => t.name));      

    // Create tables if they doesn't exist
    await db.execAsync(`
      
      CREATE TABLE IF NOT EXISTS species (
        speciesID INTEGER NOT NULL PRIMARY KEY,
        commonName TEXT NOT NULL,
        indoor INT NOT NULL,
        family TEXT NULL,
        UNIQUE (commonName) ON CONFLICT ABORT
      );

      CREATE TABLE IF NOT EXISTS locations (
        locationID INTEGER NOT NULL PRIMARY KEY,
        locationName TEXT NOT NULL,
        indoor INT NOT NULL,
        UNIQUE (locationName) ON CONFLICT ABORT
      );

      CREATE TABLE IF NOT EXISTS plantImages (
        imageID INTEGER NOT NULL PRIMARY KEY,
        image TEXT NULL        
      );

       CREATE TABLE IF NOT EXISTS plantLogs (
        logID INTEGER NOT NULL PRIMARY KEY,
        logDate TEXT NULL,
        notes TEXT NULL
      );

      CREATE TABLE IF NOT EXISTS plants (
       plantID INTEGER NOT NULL PRIMARY KEY,
       speciesID INTEGER NOT NULL,
       locationID INTEGER NOT NULL,
       imageID INTEGER NULL,
       logID INTEGER NULL,
       Nickname TEXT NOT NULL,
       indoor INT NOT NULL,
       dateAcquired TEXT NULL,
       lastFertilized TEXT NULL, 
       lastWatered TEXT NULL,
       soilType TEXT NULL,
       sunlightPreferences TEXT NULL,
       temperature TEXT NULL,
       UNIQUE(Nickname, speciesID, locationID) ON CONFLICT ABORT,
       FOREIGN KEY (speciesID) REFERENCES species(speciesID) ON DELETE CASCADE,
       FOREIGN KEY (locationID) REFERENCES locations(locationID) ON DELETE CASCADE,
       FOREIGN KEY (imageID) REFERENCES plantImages(imageID) ON DELETE CASCADE,
       FOREIGN KEY (logID) REFERENCES plantLogs(logID) ON DELETE CASCADE
      );
    `);

    // Check all existing tables
    const tableResults = await db.getAllAsync(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    console.log('Final tables in database:', tableResults.map(t => t.name));

    // Log row counts for each table
    for (const table of tableResults) {
      const countResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${table.name}`
      );
      console.log(`${table.name} has ${countResult.count} rows`);
    }
   
    // Check if data exists in species before inserting
    const countSpeciesResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM species`);
    if (countSpeciesResult.count === 0) {
      await db.execAsync(`
        INSERT INTO species (commonName, indoor) VALUES 
          ('Snake Plant', 1),
          ('Hosta', 0),
          ('Boston Fern', 1),
          ('Philodendren', 1),
          ('ZZ Plant', 1),
          ('Pothos', 1);
      `);
    }

    // Check if data exists in locations before inserting
    const countLocationResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM locations`);
    if (countLocationResult.count === 0) {
      await db.execAsync(`
        INSERT INTO locations (locationName, indoor) VALUES 
          ('Living Room', 1),
          ('Bedroom', 1),
          ('Kitchen', 1),
          ('Bathroom', 1),
          ('Office', 1),
          ('Patio', 0),
          ('Garden Bed 1', 0),
          ('Front Porch', 0);
      `);
    } 

     // Check if data exists in plants before inserting
     const countPlantResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM plants`);
     if (countPlantResult.count === 0) {
       await db.execAsync(`
         INSERT INTO plants (Nickname, speciesID, locationID, indoor)
         SELECT 'Patrick', 
           (SELECT speciesID FROM species WHERE commonName = 'Snake Plant'),
           (SELECT locationID FROM locations WHERE locationName = 'Living Room'),
           1;
 
         INSERT INTO plants (Nickname, speciesID, locationID, indoor)
         SELECT 'Lucy',
           (SELECT speciesID FROM species WHERE commonName = 'Hosta'),
           (SELECT locationID FROM locations WHERE locationName = 'Garden Bed 1'),
           0;
 
         INSERT INTO plants (Nickname, speciesID, locationID, indoor)
         SELECT 'Fernise',
           (SELECT speciesID FROM species WHERE commonName = 'Boston Fern'),
           (SELECT locationID FROM locations WHERE locationName = 'Kitchen'),
           1;
       `);
     }   
              
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    return false;
  }
};

export const resetDatabase = async () => {
  try {
    // Close existing connection
    if (db) {
      await db.closeAsync();
      db = null;
    }
    
    // Delete database file
    await FileSystem.deleteAsync(
      FileSystem.documentDirectory + 'SQLite/' + dbName,
      { idempotent: true }
    );
    
    // Reinitialize database
    return await setupDatabase();
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};

export const cleanupDuplicatePlants = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(`
      DELETE FROM plants 
      WHERE plantID NOT IN (
        SELECT MIN(plantID)
        FROM plants
        GROUP BY Nickname, speciesID, locationID
      );
    `);
    return true;
  } catch (error) {
    console.error('Error cleaning up duplicate plants:', error);
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
    const results = await db.getAllAsync(`
      SELECT 
        plants.*,
        species.commonName as speciesName,
        locations.locationName
      FROM plants
      LEFT JOIN species ON plants.speciesID = species.speciesID
      LEFT JOIN locations ON plants.locationID = locations.locationID
      WHERE plants.indoor = 1
      ORDER BY plants.plantID DESC
    `);
    console.log("Fetched indoor plants:", results);
    return results || [];
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
    const results = await db.getAllAsync(`
      SELECT 
        plants.*,
        species.commonName as speciesName,
        locations.locationName
      FROM plants
      LEFT JOIN species ON plants.speciesID = species.speciesID
      LEFT JOIN locations ON plants.locationID = locations.locationID
      WHERE plants.indoor = 0
      ORDER BY plants.plantID DESC
    `);
    console.log("Fetched outdoor plants:", results);
    return results || [];
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
    const results = await db.getAllAsync(`
      SELECT 
        plants.*,
        species.commonName as speciesName,
        locations.locationName
      FROM plants
      LEFT JOIN species ON plants.speciesID = species.speciesID
      LEFT JOIN locations ON plants.locationID = locations.locationID
      WHERE plants.indoor = 0
    `);
    console.log("Fetched outdoor plants:", results);
    return results || [];
  } catch (error) {
    console.error('Error fetching outdoor plants:', error);
    return [];
  }
};

export const addSpecies = async (commonName : string, indoor : number) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO species (commonName, indoor) VALUES (?, ?)',
      [commonName, indoor ? 1 : 0]
    );
    return true;
  } catch (error) {
    console.error('Error adding species:', error);
    return false;
  }
};

export const addLocation = async (locationName : string, indoor : number) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO locations (locationName, indoor) VALUES (?, ?)',
      [locationName, indoor ? 1 : 0]
    );
    return true;
  }
  catch (error) {
    console.error('Error adding location:', error);
    return false;
  }
};

export const addPlant = async (Nickname : string, speciesID : number , indoor : number, locationID : number) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO plants (Nickname, speciesID, indoor, locationID ) VALUES (?, ?, ?, ?)',
      [Nickname, speciesID, indoor ? 1 : 0, locationID]
    );
    return true;
  } catch (error) {
    console.error('Error adding plants:', error);
    return false;
  }
};

export const getPlantById = async ( plantID: number ) => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync(`
      SELECT 
        plants.*,
        species.commonName as speciesName,
        locations.locationName
      FROM plants
      LEFT JOIN species ON plants.speciesID = species.speciesID
      LEFT JOIN locations ON plants.locationID = locations.locationID
      WHERE plants.plantID = ?
    `, [plantID]);
    
    return result || null;
  } catch (error) {
    console.error('Error fetching plant by ID:', error);
    throw error;
  }
};

export const updatePlant = async (plantData: any) => {
  try {
    const db = await getDatabase();
    await db.runAsync(`
      UPDATE plants
      SET 
        Nickname = ?,
        soilType = ?,
        temperature = ?,
        sunlightPreferences = ?,
        locationID = ?,
        speciesID = ?,
        lastWatered = ?
      WHERE plantID = ?
    `, [
      plantData.Nickname,
      plantData.soilType,
      plantData.temperature,
      plantData.sunlightPreferences,
      plantData.locationID,
      plantData.speciesID,
      plantData.lastWatered,
      plantData.plantID
    ]);
    console.log('Plant updated successfully.');
  } catch (error) {
    console.error('Error updating plant:', error);
    throw error;
  }
};

// ***FUNCTION IN PROGRESS***
export const addPlantLog = async (plantID: number, logDate: string, notes: string) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO plantLogs (plantID, logDate, notes) VALUES (?, ?, ?)',
      [plantID, logDate, notes]
    );
    return true;
  } catch (error) {
    console.error('Error adding plant log:', error);
    return false;
  }
};

// ***FUNCTION IN PROGRESS***
// export const deletePlant = async (plantID: number) => {
//   try {
//     const db = await getDatabase();
//     await db.runAsync('DELETE FROM plants WHERE plantID = ?', [plantID]);
//     return true;
//   } catch (error) {
//     console.error('Error deleting plant:', error);
//     return false;
//   }
// };

