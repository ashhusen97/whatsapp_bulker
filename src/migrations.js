import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
sqlite3.verbose();

const dbFile = process.env.DATABASE_FILE || "./data.sqlite";

// Create folders
const dir = path.dirname(dbFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Connect to database
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
    process.exit(1);
  }
});

// Run migrations
db.serialize(() => {
  // Jobs table: stores each message to be sent
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      phone TEXT,
      message TEXT,
      status TEXT,
      error TEXT,
      created_at INTEGER,
      sent_at INTEGER,
      provider_id TEXT
    );
  `);

  // Map customer to user (for routing replies)
  db.run(`
    CREATE TABLE IF NOT EXISTS customer_map (
      phone TEXT PRIMARY KEY,
      user_id TEXT,
      updated_at INTEGER
    );
  `);

  // inbound messages log
  db.run(`
    CREATE TABLE IF NOT EXISTS inbound (
      id TEXT PRIMARY KEY,
      from_phone TEXT,
      body TEXT,
      received_at INTEGER
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT
    );
  `);

  console.log("✅ Migrations ran. DB:", dbFile);
});

export default db;
