import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/**
 * Salted scrypt hash, stored as "salt:hash" (both hex). No third-party crypto
 * library needed. Deliberately not "server-only": scripts/create-admin.ts runs
 * this outside the Next.js runtime, same as db/migrate.ts does for migrations.
 * node:crypto cannot bundle into a browser build regardless.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const storedBuf = Buffer.from(hash, "hex");
  if (storedBuf.length !== derived.length) return false;
  return timingSafeEqual(derived, storedBuf);
}
