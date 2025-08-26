import dotenv from "dotenv";
import pLimit from "p-limit";
import { fetchQueued, markSent, markFailed, upsertCustomerMap } from "./db.js";
import { sendText } from "./whatsapp.js";

dotenv.config();
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "4", 10);
const DELAY_MS = parseInt(process.env.WORKER_DELAY_MS || "500", 10);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function processJob(job) {
  try {
    const result = await sendText(job.phone, job.message);
    // result may contain id(s)
    markSent(job.id, result?.messages?.[0]?.id || null);
    // keep map for reply routing
    upsertCustomerMap(job.phone, job.user_id);
    console.log("Sent", job.phone, job.id);
  } catch (err) {
    console.error("Failed to send", job.id, job.phone, err.message || err);
    markFailed(job.id, String(err.message || err));
  }
}

async function loop() {
  const limit = pLimit(CONCURRENCY);
  while (true) {
    const jobs = await fetchQueued(50);
    console.log("JONS", jobs);
    // if (!jobs || jobs.length === 0) {
    //   await sleep(2000);
    //   continue;
    // }

    // const tasks = jobs.map((j) =>
    //   limit(async () => {
    //     await processJob(j);
    //     await sleep(DELAY_MS);
    //   })
    // );

    // await Promise.all(tasks);
  }
}

loop().catch((e) => {
  console.error(e);
  process.exit(1);
});
