import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import "./models/index.js";
import sequelize from "./config/sequelize.js";
import { closeRedis, connectRedis, isRedisConfigured, isRedisReady } from "./config/redis.js";
import authRoutes from "./modules/auth/auth.route.js";
import personalRoutes from "./modules/personal/personal.route.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";
import { apiLimit } from "./middlewares/rateLimiting.js";
import { renderMetrics, requestObservability } from "./middlewares/observability.js";
import logger from "./utility/logger.js";

dotenv.config({ quiet: true });

const app = express();
const port = Number(process.env.PORT) || 5000;
const trustProxyHops = process.env.TRUST_PROXY_HOPS
  ? Number(process.env.TRUST_PROXY_HOPS)
  : process.env.NODE_ENV === "production" ? 1 : 0;
let server;
let shuttingDown = false;

if (trustProxyHops > 0) app.set("trust proxy", trustProxyHops);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error("CORS origin зөвшөөрөгдөөгүй.");
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(hpp());
app.use(requestObservability);

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptimeSeconds: Math.floor(process.uptime()) });
});

app.get("/ready", async (req, res) => {
  let databaseReady = false;
  try {
    await sequelize.authenticate();
    databaseReady = true;
  } catch (error) {
    logger.warn("Readiness database check failed", { requestId: req.id, error });
  }
  const redisReady = isRedisReady();
  const ready = !shuttingDown && databaseReady && redisReady;
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    checks: { database: databaseReady, redis: redisReady },
  });
});

app.get("/metrics", async (req, res) => {
  const metricsToken = process.env.METRICS_TOKEN;
  if (metricsToken && req.headers.authorization !== `Bearer ${metricsToken}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  let databaseReady = false;
  try {
    await sequelize.authenticate();
    databaseReady = true;
  } catch {
    databaseReady = false;
  }
  res.type("text/plain; version=0.0.4").send(renderMetrics({
    databaseReady,
    redisReady: isRedisReady(),
  }));
});

app.use("/api", apiLimit);
app.use("/api/auth", authRoutes);
app.use("/api/me", personalRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    server = app.listen(port, () => logger.info("HTTP server started", {
      port,
      environment: process.env.NODE_ENV || "development",
      redisConfigured: isRedisConfigured(),
      trustProxyHops,
    }));
  } catch (error) {
    logger.error("Application startup failed", { error });
    await Promise.allSettled([sequelize.close(), closeRedis()]);
    process.exit(1);
  }
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info("Graceful shutdown started", { signal });

  const forceExit = setTimeout(() => {
    logger.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  try {
    if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await Promise.allSettled([sequelize.close(), closeRedis()]);
    clearTimeout(forceExit);
    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Graceful shutdown failed", { error });
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (error) => logger.error("Unhandled rejection", { error }));
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  shutdown("uncaughtException");
});

start();

export default app;
