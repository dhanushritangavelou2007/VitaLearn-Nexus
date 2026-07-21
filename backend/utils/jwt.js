import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function getJwtSecret(secret) {
  const resolvedSecret = secret || process.env.JWT_SECRET;

  if (!resolvedSecret || !String(resolvedSecret).trim()) {
    throw new Error("JWT_SECRET is missing in the .env file.");
  }

  return resolvedSecret;
}

export function signToken(payload, secret, expiresIn = process.env.JWT_EXPIRES_IN || "7d") {
  try {
    return jwt.sign(payload, getJwtSecret(secret), { expiresIn });
  } catch (error) {
    throw new Error(`Unable to generate JWT token: ${error.message}`);
  }
}

export function verifyToken(token, secret) {
  try {
    return jwt.verify(token, getJwtSecret(secret));
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
}

