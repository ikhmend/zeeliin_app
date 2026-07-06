import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import dotenv from "dotenv";
import { getRedisClient, isRedisConfigured } from "../config/redis.js";

dotenv.config({ quiet: true });

class RedisRateLimitStore {
  constructor(prefix) {
    this.prefix = `rate-limit:${prefix}:`;
    this.localKeys = true;
    this.windowMs = 60_000;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  async increment(key) {
    const client = getRedisClient();
    if (!client?.isReady) throw new Error("Redis rate-limit store is unavailable");
    const result = await client.eval(
      `local count = redis.call('INCR', KEYS[1])
       if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
       local ttl = redis.call('PTTL', KEYS[1])
       return {count, ttl}`,
      { keys: [`${this.prefix}${key}`], arguments: [String(this.windowMs)] },
    );
    const [totalHits, ttl] = result.map(Number);
    return { totalHits, resetTime: new Date(Date.now() + Math.max(ttl, 0)) };
  }

  async decrement(key) {
    const client = getRedisClient();
    if (client?.isReady) await client.decr(`${this.prefix}${key}`);
  }

  async resetKey(key) {
    const client = getRedisClient();
    if (client?.isReady) await client.del(`${this.prefix}${key}`);
  }
}

function sharedStore(name) {
  return isRedisConfigured() ? new RedisRateLimitStore(name) : undefined;
}

export const limitRate= rateLimit({
    store: sharedStore("login"),
    windowMs: 15*60*1000,
    limit: 5,
    skipSuccessfulRequests:true,
    message:{
        success:false,
        error:"15 минутын дараагаар дахин оролдоно уу.",
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
});
export const apiLimit= rateLimit({
    store: sharedStore("api"),
    windowMs:15*60*1000,
    limit: 300,
    message:{
        success:false,
        error:"Too many requests."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
});
export const regsiterLimit= rateLimit({
    store: sharedStore("register"),
    windowMs:60*60*1000,
    limit: 5,
    skipSuccessfulRequests:true,
    message:{
        success:false,
        error:"15 минутын дараагаар дахин оролдоно уу."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
});
export const paymentLimit= rateLimit({
    store: sharedStore("payment"),
    windowMs:1*60*1000,
    limit:5,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    message:{
        success:false,
        error:"Түр хүлээгээд дахин оролдоно уу."
    }
});
export const passwordChangeLimit= rateLimit({
  store: sharedStore("password-change"),
  windowMs:5*60*1000,
  limit: 5,
  standardHeaders:"draft-8",
  legacyHeaders:false,
  message:{
    success: false,
    error:"Хэт олон удаагийн оролдлого. 15 минутын дараагийн оролдоно уу."
  }
});
export const forgotPasswordIpLimiter = rateLimit({
  store: sharedStore("forgot-password-ip"),
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  statusCode: 429,
  message: {
    success: false,
    error: "Хэт олон оролдлого, 15 минутын дараа дахин доролдоно уу.",
  },
});
export const resetPasswordLimiter = rateLimit({
  store: sharedStore("reset-password"),
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Хэт олон удаа оролдлоо. 15 минутын дараа дахин оролдоно уу.",
  },
});
export const forgotPasswordEmailLimiter = rateLimit({
  store: sharedStore("forgot-password-email"),
  windowMs: 15 * 60 * 1000,
  limit: 1,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email;
    if (typeof email === "string" && email.trim()) {
      return `email:${email.trim().toLowerCase()}`;
    }
    return `ip:${ipKeyGenerator(req.ip)}`;
  },
  message: {
    success: false,
    error: "Хэт олон хүсэлт илгээлээ. 15 минутын дараа дахин оролдоно уу.",
  },
});

