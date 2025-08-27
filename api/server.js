const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("✅ Hello from Express on Vercel!");
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Export the serverless handler
module.exports.handler = serverless(app);
