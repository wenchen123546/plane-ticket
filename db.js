import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export a unified interface
const dbInterface = {
  prepare: null,
  exec: null,
  isPostgres: false,
};

if (process.env.DATABASE_URL) {
  // --- PostgreSQL Mode (Cloud/Production) ---
  console.log('🔗 Connecting to PostgreSQL Cloud Database...');
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  dbInterface.isPostgres = true;

  // Polyfill `prepare` and `exec` to match better-sqlite3 API roughly
  dbInterface.exec = async (sql) => {
    return await pool.query(sql);
  };
  
  dbInterface.prepare = (sql) => {
    // Convert SQLite ? syntax to Postgres $1, $2 syntax
    let pgSql = sql;
    let index = 1;
    while(pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${index++}`);
    }
    
    return {
      run: async (...params) => {
        return await pool.query(pgSql, params);
      },
      get: async (...params) => {
        const res = await pool.query(pgSql, params);
        return res.rows[0];
      },
      all: async (...params) => {
        const res = await pool.query(pgSql, params);
        return res.rows;
      }
    };
  };

  // Initialize Tables for Postgres
  const initDb = async () => {
    try {
      await dbInterface.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS saved_flights (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          flight_data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS passenger_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          profile_data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ PostgreSQL Tables Ready');
    } catch (err) {
      console.error('❌ Failed to initialize PostgreSQL:', err);
    }
  };
  initDb();

} else {
  // --- SQLite Mode (Local Development) ---
  console.log('🔗 Connecting to Local SQLite Database...');
  const db = new Database(path.join(__dirname, 'nexus_flight.db'));

  dbInterface.prepare = (sql) => {
    const stmt = db.prepare(sql);
    return {
      run: async (...params) => stmt.run(...params),
      get: async (...params) => stmt.get(...params),
      all: async (...params) => stmt.all(...params)
    };
  };
  dbInterface.exec = async (sql) => db.exec(sql);
  dbInterface.isPostgres = false;

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS saved_flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      flight_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
    CREATE TABLE IF NOT EXISTS passenger_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      profile_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
}

export default dbInterface;
