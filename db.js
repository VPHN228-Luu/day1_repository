const Database = require('better-sqlite3');
const path = require('path');

// Use an in-memory database when DB_PATH=':memory:' (used by tests).
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
