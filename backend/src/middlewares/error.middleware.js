import AppError from "../utility/AppError.js";
import logger from "../utility/logger.js";

/**
 * Converts an unmatched request into an {@link AppError} and forwards it to
 * the centralized error handler. Register this middleware after all routes.
 *
 * @param {import("express").Request} req - The unmatched HTTP request.
 * @param {import("express").Response} res - Express response (unused).
 * @param {import("express").NextFunction} next - Passes the 404 error onward.
 * @returns {void}
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(
      `${req.method} ${req.originalUrl} endpoint олдсонгүй.`,
      404
    )
  );
}

/**
 * Express error-handling middleware that normalizes application, Sequelize,
 * JWT, and request-body parser errors into a consistent JSON response.
 *
 * Known errors are translated to an appropriate HTTP status and a safe,
 * user-facing Mongolian message. All 500 responses hide the original message.
 * In development only, the original message and stack trace are included to
 * aid debugging. Register this middleware last, after routes and the 404
 * handler; Express identifies it as an error handler by its four parameters.
 *
 * Response shape:
 * `{ success: false, message: string, error?: string, stack?: string }`
 *
 * @param {Error & {statusCode?: number|string, type?: string, errors?: Array<{message: string}>}} error
 *   Error forwarded by Express or another middleware.
 * @param {import("express").Request} req - Request associated with the error (unused).
 * @param {import("express").Response} res - Response used to send the normalized error.
 * @param {import("express").NextFunction} next - Required by Express error-handler signature (unused).
 * @returns {import("express").Response} The completed JSON error response.
 */
export function errorHandler(error, req, res, next) {
  logger.error("Request failed", {
    requestId: req.id,
    method: req.method,
    path: req.path,
    error,
  });
  let status = Number(error.statusCode) || 500;
  let message = error.message || "Серверийн алдаа.";
  if (error.name === "SequelizeValidationError") {
    status = 400;
    message = error.errors?.map((item) => item.message).join(", ") || "Оруулсан мэдээлэл шаардлага хангахгүй байна.";
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    status = 409;
    message =error.errors?.map((item) => item.message).join(", ") || "Давхардсан мэдээлэл байна.";
  }
  if (error.name === "SequelizeForeignKeyConstraintError") {
    status = 409;
    message = "Холбоотой мэдээлэл олдоогүй.";
  }
  if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "Хүчингүй token байна.";
  }
  if (error.name === "TokenExpiredError") {
    status = 401;
    message = "Нэвтрэх хугацаа дууссан байна.";
  }
  if (error instanceof SyntaxError && error.type === "entity.parse.failed"){
    status = 400;
    message = "JSON өгөгдлийн бүтэц буруу.";
  }
  if (error.type === "entity.too.large") {
    status = 413;
    message = "Илгээсэн өгөгдлийн хэмжээ хэтэрсэн.";
  }
  return res.status(status).json({
    success: false,
    message: status === 500 ? "Серверийн дотоод алдаа." : message, ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  });
}
