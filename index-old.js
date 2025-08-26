const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const path = require("path");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, "my_session"), // fixed location for persistence
  }),
});

client.on("qr", (qr) => {
  console.log("📲 Scan this QR code to log in (first time only):");
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("✅ WhatsApp is ready!");

  const numbers = ["12121212", "12121212", "1212121212"];

  for (const number of numbers) {
    const chatId = number + "@c.us";
    const exists = await client.isRegisteredUser(chatId);

    if (exists) {
      await client.sendMessage(
        chatId,
        "Hello! This is a test message from my Node.js bot 🚀"
      );
      console.log(`📩 Message sent to ${number}`);
    } else {
      console.log(`⚠ Skipping ${number} — not on WhatsApp`);
    }

    await new Promise((res) => setTimeout(res, 1000)); // delay to avoid rate limit
  }

  console.log("✅ All messages processed!");
  process.exit();
});

client.on("auth_failure", (msg) => {
  console.error("❌ AUTH FAILURE", msg);
});

client.initialize();
