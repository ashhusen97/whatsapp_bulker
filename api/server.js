import express from "express";

import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send("App is Ruuningg");
});

app.listen(PORT, () =>
  console.log(`🚀 API + Socket.IO listening on port ${3000}`)
);
