import express from "express";
import dotenv from "dotenv";
import { findUserByCustomer, logInbound } from "./db.js";

dotenv.config();
const app = express();
app.use(express.json());

// GET endpoint for webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages) {
      for (const m of messages) {
        const from = m.from; // phone digits like '92300...'
        const text = m.text?.body || m?.button?.text || JSON.stringify(m);
        logInbound({ from_phone: from, body: text });

        const userId = findUserByCustomer(from);
        if (userId) {
          // push to your app: placeholder - you should integrate real push (websocket/push)
          console.log(`Routed inbound from ${from} to user ${userId}: ${text}`);
        } else {
          console.log(`Inbound from ${from} (no mapping): ${text}`);
        }
      }
    }
  } catch (err) {
    console.error("webhook error", err);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Webhook receiver listening on", PORT));
