import * as SQLite from 'expo-sqlite';

const dbName = 'disainer_cart.db';
let dbInstance = null;

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(dbName);
  }
  return dbInstance;
};

export const initDatabase = async () => {
  const db = await getDb();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY NOT NULL, 
      serviceId TEXT NOT NULL, 
      name TEXT NOT NULL, 
      price REAL NOT NULL, 
      quantity INTEGER NOT NULL
    );
  `);
  
  return db;
};
