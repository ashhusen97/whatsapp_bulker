const fetch = require("node-fetch");

import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

if (!TOKEN || !PHONE_NUMBER_ID)
  console.warn("WHATSAPP_TOKEN or PHONE_NUMBER_ID not set");

export async function sendText(phoneDigits, text) {
  // phoneDigits should be like '923001234567' (no +)
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to: phoneDigits,
    type: "text",
    text: { body: text },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(JSON.stringify(data));
  }
  // return message id
  return data;
}
