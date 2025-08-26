import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();
sqlite3.verbose();

const dbFile = process.env.DATABASE_FILE || "./data.sqlite";
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.all(`PRAGMA table_info(users);`, (err, columns) => {
    if (err) {
      console.error("❌ Error checking users table:", err.message);
      return;
    }

    const colNames = columns.map((c) => c.name);

    if (!colNames.includes("username")) {
      db.run(`ALTER TABLE users ADD COLUMN username TEXT;`);
      console.log("✅ Added 'username' column");
    }
    if (!colNames.includes("password")) {
      db.run(`ALTER TABLE users ADD COLUMN password TEXT;`);
      console.log("✅ Added 'password' column");
    }

    // ✅ close here after all ALTER TABLE queries
    db.close();
  });
});
