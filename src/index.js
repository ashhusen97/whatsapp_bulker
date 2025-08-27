// import express from "express";
// import formidable from "formidable";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { parseCsv, normalizeNumber } from "./utils.js";
// import qrcode from "qrcode";
// import pkg from "whatsapp-web.js";
// const { Client, LocalAuth } = pkg;
// import { Server } from "socket.io";
// import http from "http";
// import {
//   createUser,
//   insertJob,
//   listJobs,
//   listJobsByUser,
//   loginUser,
// } from "./db.js";
// import pLimit from "p-limit";
// import cors from "cors";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// const PORT = process.env.PORT || 3000;
// const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "4", 10);

// // --- HTTP + Socket.io setup ---
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// // --- WhatsApp client setup ---
// let qrCodeData = null;
// let isConnected = false;
// let client;
// let isProcessing = false;

// // --- Socket.io events ---
// io.on("connection", (socket) => {
//   console.log("🟢 React connected to Socket.IO");

//   // send last QR if available
//   if (qrCodeData) {
//     socket.emit("qr", qrCodeData);
//   }

//   socket.on("getStatus", () => {
//     if (isConnected) {
//       socket.emit("ready", "WhatsApp Connected");
//     } else if (qrCodeData) {
//       socket.emit("qr", qrCodeData);
//     } else {
//       socket.emit("disconnected");
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 React disconnected");
//   });
// });
// // --- API Routes ---
// app.get("/", (req, res) => {
//   return res.send("App is Ruuningg");
// });
// app.get("/status", (req, res) => {
//   res.json({
//     isConnected,
//     qrCodeData,
//   });
// });

// // --- Start server with Socket.IO ---
// server.listen(PORT, () =>
//   console.log(`🚀 API + Socket.IO listening on port ${PORT}`)
// );

const fs = require("fs");

const formidable = require("formidable");
const express = require("express");
const app = express();
const { listJobs } = require("../src/db");
app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await listJobs(100);
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// app.get("/userJobs/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     const jobs = await listJobsByUser(userId, 50);
//     res.json(jobs);
//   } catch (err) {
//     console.error("Error fetching user jobs:", err);
//     res.status(500).json({ error: "Failed to fetch jobs" });
//   }
// });

// app.post("/upload", (req, res) => {
//   if (isProcessing) {
//     return res.status(400).json({ message: "Already processing file" });
//   }

//   const form = formidable({ multiples: false });
//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(400).send(err.message);

//     const file = files.file;
//     const template = fields.template;
//     const campaignName = fields.campaignName;
//     if (!file) return res.status(400).send("file required");

//     // temp + dest paths
//     const tmpPath = file.filepath || file.path;
//     const dest = path.join(
//       __dirname,
//       "uploads",
//       `${Date.now()}-${file.originalFilename}`
//     );
//     fs.mkdirSync(path.dirname(dest), { recursive: true });
//     fs.copyFileSync(tmpPath, dest);

//     // parse CSV
//     const records = parseCsv(dest);

//     const inserted = [];
//     const totalMessages = records.length;
//     let sentMessages = 0;
//     let failedMessages = 0;

//     isProcessing = true;

//     for (const r of records) {
//       const phone = normalizeNumber(r.phone || r.number || r.mobile);
//       const message = r.message || r.text || "";
//       const user_id = r.user_id || fields.user_id || null;

//       if (!phone || !message) {
//         failedMessages++;
//         continue;
//       }

//       const response_ = await fetch(
//         `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             messaging_product: "whatsapp",
//             to: phone,
//             type: "template",
//             template: { name: template, language: { code: "en" } },
//           }),
//         }
//       );
//       console.log("Whatsapp api response", response_);
//       const id = insertJob({ user_id, phone, message: template });

//       io.emit("progress", {
//         sent: sentMessages,
//         total: totalMessages,
//         status: "sent", // or "failed"
//         message: `Message sent to ${phone}`,
//       });
//       inserted.push(id);
//       sentMessages++;
//     }

//     isProcessing = false;

//     res.json({
//       ok: true,
//       inserted,
//       stats: {
//         total: totalMessages,
//         sent: sentMessages,
//         failed: failedMessages,
//       },
//     });
//   });
// });

// app.post("/create-user", async (req, res) => {
//   try {
//     const { name, username, password } = req.body;
//     if (!name || !username || !password) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const id = await createUser({ name, username, password });
//     res.json({ success: true, id });
//   } catch (err) {
//     console.error("❌ Error creating user:", err.message);
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await loginUser({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error logging in:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// app.get("/templates", async (req, res) => {
//   console.log(process.env);
//   try {
//     const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/message_templates`;

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//       },
//     });

//     const data = await response.json();

//     console.log("Templates data", data, url);
//     // Optional: filter only approved templates
//     const approved = data.data?.filter((t) => t.status === "APPROVED") || [];

//     res.json({ templates: approved });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch templates" });
//   }
// });
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
