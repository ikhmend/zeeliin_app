import crypto from "crypto";
import logger from "../utility/logger.js";

const requestCounts = new Map();
let totalDurationSeconds = 0;
let totalRequests = 0;

function escapeLabel(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

export function requestObservability(req, res, next) {
  const startedAt = process.hrtime.bigint();
  req.id = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1e9;
    const key = `${req.method}:${res.statusCode}`;
    requestCounts.set(key, (requestCounts.get(key) || 0) + 1);
    totalRequests += 1;
    totalDurationSeconds += durationSeconds;
    logger.info("HTTP request completed", {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Math.round(durationSeconds * 1000),
      ip: req.ip,
    });
  });
  next();
}

export function renderMetrics({ databaseReady }) {
  const lines = [
    "# HELP zeeliin_http_requests_total Total HTTP responses.",
    "# TYPE zeeliin_http_requests_total counter",
  ];
  for (const [key, count] of requestCounts) {
    const [method, status] = key.split(":");
    lines.push(`zeeliin_http_requests_total{method="${escapeLabel(method)}",status="${escapeLabel(status)}"} ${count}`);
  }
  lines.push(
    "# HELP zeeliin_http_request_duration_seconds_sum Total request duration.",
    "# TYPE zeeliin_http_request_duration_seconds_sum counter",
    `zeeliin_http_request_duration_seconds_sum ${totalDurationSeconds}`,
    "# HELP zeeliin_http_request_duration_seconds_count Timed requests.",
    "# TYPE zeeliin_http_request_duration_seconds_count counter",
    `zeeliin_http_request_duration_seconds_count ${totalRequests}`,
    "# HELP zeeliin_database_ready Database readiness state.",
    "# TYPE zeeliin_database_ready gauge",
    `zeeliin_database_ready ${databaseReady ? 1 : 0}`,
    "# HELP process_uptime_seconds Process uptime.",
    "# TYPE process_uptime_seconds gauge",
    `process_uptime_seconds ${process.uptime()}`,
    "# HELP process_resident_memory_bytes Resident memory size.",
    "# TYPE process_resident_memory_bytes gauge",
    `process_resident_memory_bytes ${process.memoryUsage().rss}`,
  );
  return `${lines.join("\n")}\n`;
}
