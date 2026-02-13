import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../cfp-rsvp.db');

export function initializeDatabase() {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id),
      level TEXT NOT NULL CHECK(level IN ('100', '300')),
      price REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(team_id) REFERENCES teams(id)
    );

    CREATE INDEX IF NOT EXISTS idx_prices_team_timestamp 
      ON prices(team_id, timestamp DESC);
  `);

  return db;
}

export function getDatabase() {
  return new Database(dbPath);
}