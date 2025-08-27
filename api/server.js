import express from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import {
  createUser,
  fetchQueued,
  insertJob,
  listJobs,
  listJobsByUser,
  loginUser,
} from "../src/db.js";
import pLimit from "p-limit";
import cors from "cors";

import { fileURLToPath } from "url";
import { sendText } from "../src/whatsapp.js";
import { normalizeNumber, parseCsv } from "../src/utils.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "4", 10);

// --- WhatsApp client setup ---
let qrCodeData = null;
let isConnected = false;
let client;
let isProcessing = false;

// --- API Routes ---
app.get("/", (req, res) => {
  return res.send("App is Ruuningg");
});

// --- Start server with Socket.IO ---
app.listen(PORT, () =>
  console.log(`🚀 API + Socket.IO listening on port ${3000}`)
);
