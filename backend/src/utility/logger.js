import dotenv from "dotenv";

dotenv.config({ quiet: true });

const levels = { debug: 10, info: 20, warn: 30, error: 40 };
const configuredLevel = process.env.LOG_LEVEL || "info";

function serializeError(error) {
  if (!(error instanceof Error)) return error;
  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  };
}

function write(level, message, context = {}) {
  if (levels[level] < (levels[configuredLevel] || levels.info)) return;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  for (const [key, value] of Object.entries(entry)) {
    if (value instanceof Error) entry[key] = serializeError(value);
    if (value === undefined) delete entry[key];
  }
  const output = JSON.stringify(entry);
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.log(output);
}

const logger = {
  debug: (message, context) => write("debug", message, context),
  info: (message, context) => write("info", message, context),
  warn: (message, context) => write("warn", message, context),
  error: (message, context) => write("error", message, context),
};

export default logger;
