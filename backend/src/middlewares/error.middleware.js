import AppError from "../utils/AppError.js";
export async function notFound(err, req, res, next){
    next (new AppError(
        `${req.method}, ${req.originalUrl} олдсонгүй.`,
    ))
}