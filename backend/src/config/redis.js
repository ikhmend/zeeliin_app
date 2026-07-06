import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "../utility/logger.js";

dotenv.config({ quiet: true });

const redisUrl = process.env.REDIS_URL;
let client = null;

export function isRedisConfigured() {
  return Boolean(redisUrl);
}

export function getRedisClient() {
  return client;
}

export function isRedisReady() {
  return !redisUrl || Boolean(client?.isReady);
}

export async function connectRedis() {
  if (!redisUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("REDIS_URL production орчинд заавал тохируулагдсан байна.");
    }
    logger.warn("Redis is not configured; rate limits use process memory");
    return null;
  }

  client = createClient({ url: redisUrl });
  client.on("error", (error) => logger.error("Redis client error", { error }));
  client.on("reconnecting", () => logger.warn("Redis client reconnecting"));
  await client.connect();
  logger.info("Redis connected");
  return client;
}

export async function closeRedis() {
  if (client?.isOpen) await client.quit();
}
