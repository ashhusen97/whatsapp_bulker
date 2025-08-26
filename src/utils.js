import fs from "fs";
import { parse } from "csv-parse/sync";

export function normalizeNumber(raw) {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  // assume full international (user should include country code)
  return digits;
}

export function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath);
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  return records;
}
