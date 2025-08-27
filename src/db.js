const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

dotenv.config();

const dbFile = process.env.DATABASE_FILE || "./data.sqlite";

// Open DB connection (async)
let db;
(async () => {
  db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });
})();

// ===== Functions =====

async function insertJob({ user_id, phone, message }) {
  const id = uuidv4();
  await db.run(
    `INSERT INTO jobs (id,user_id,phone,message,status,created_at) VALUES (?,?,?,?,?,?)`,
    [id, user_id, phone, message, "queued", Date.now()]
  );
  return id;
}

async function fetchQueued(limit = 50) {
  return await db.all(
    `SELECT * FROM jobs WHERE status = 'queued' ORDER BY created_at LIMIT ?`,
    [limit]
  );
}

async function markSent(id, provider_id = null) {
  await db.run(
    `UPDATE jobs SET status = 'sent', sent_at = ?, provider_id = ? WHERE id = ?`,
    [Date.now(), provider_id, id]
  );
}

async function markFailed(id, error) {
  await db.run(`UPDATE jobs SET status = 'failed', error = ? WHERE id = ?`, [
    error,
    id,
  ]);
}

async function upsertCustomerMap(phone, user_id) {
  const exists = await db.get(`SELECT 1 FROM customer_map WHERE phone = ?`, [
    phone,
  ]);
  if (exists) {
    await db.run(
      `UPDATE customer_map SET user_id = ?, updated_at = ? WHERE phone = ?`,
      [user_id, Date.now(), phone]
    );
  } else {
    await db.run(
      `INSERT INTO customer_map (phone,user_id,updated_at) VALUES (?,?,?)`,
      [phone, user_id, Date.now()]
    );
  }
}

async function findUserByCustomer(phone) {
  const row = await db.get(`SELECT user_id FROM customer_map WHERE phone = ?`, [
    phone,
  ]);
  return row?.user_id || null;
}

async function logInbound({ id = uuidv4(), from_phone, body }) {
  await db.run(
    `INSERT INTO inbound (id,from_phone,body,received_at) VALUES (?,?,?,?)`,
    [id, from_phone, body, Date.now()]
  );
}

async function getJob(id) {
  return await db.get(`SELECT * FROM jobs WHERE id = ?`, [id]);
}

async function listJobs(limit = 50) {
  return await db.all(`SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?`, [
    limit,
  ]);
}

async function listJobsByUser(userId, limit = 50) {
  return await db.all(
    `SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  );
}

async function createUser({ name, username, password }) {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.run(
    `INSERT INTO users (id, name,username,password) VALUES (?, ?,?,?)`,
    [id, name, username, hashedPassword]
  );
  return id;
}

async function loginUser({ username, password }) {
  const user = await db.get(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);
  console.log(user);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, name: user.name, username: user.username };
}

// Export all functions
module.exports = {
  insertJob,
  fetchQueued,
  markSent,
  markFailed,
  upsertCustomerMap,
  findUserByCustomer,
  logInbound,
  getJob,
  listJobs,
  listJobsByUser,
  createUser,
  loginUser,
};
