import { rateLimit, ipKeyGenerator } from "express-rate-limit";
export const limitRate= rateLimit({
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

