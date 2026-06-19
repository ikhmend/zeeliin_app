import AppError from "../utility/AppError.js";
export function notFoundHandler(req, res, next) {
  next(new AppError(
      `${req.method} ${req.originalUrl} endpoint олдсонгүй.`,
      404
    )
  );
}
export function errorHandler(error, req, res, next) {
  console.error("Error:", error);
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