import * as authService from "./auth.service.js"
import asyncHandler from "../../utility/asyncHandler.js";
import {Success} from "../../utility/sendResponse.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
};
export const getMe= asyncHandler(async (req, res) => {
    const data= await authService.getMe(req.user.id);
    return Success(res, data);
});
export const login= asyncHandler(async (req, res) => {
    const data= await authService.login(req.validated.body);
    res.cookie("refreshToken", data.rtoken, refreshCookieOptions);
    return Success(res, {token: data.token, user:data.user}, 200, "Амжилттай нэвтэрлээ.");
});
export const register= asyncHandler(async (req, res) => {
    const data= await authService.register(req.validated.body);
    return Success(res, data, 201, "Амжилттай бүртгэгдлээ")
});
export const changeMyPassword= asyncHandler(async (req, res) => {
    const data= await authService.changeMyPassword(req.user.id, req.validated.body);
    return Success(res, data, 200, "Нууц үг амжилттай солигдсон.");
});
export const refresh= asyncHandler(async (req, res) => {
    const data= await authService.refresh(req.cookies.refreshToken);
    return Success(res, {token: data.token}, 200, "Access token шинэчлэгдсэн.");
});
export const logout = asyncHandler(async (req, res) => {
    const refreshToken =req.cookies.refreshToken;
    await authService.logout(refreshToken);
    const clearOptions = { ...refreshCookieOptions };
    delete clearOptions.maxAge;
    res.clearCookie("refreshToken", clearOptions);
    return Success(res,null, 200, "Амжилттай гарлаа.");
  });
export const forgotPassword = asyncHandler(async (req, res) => {
    const {email}=req.validated.body;
    await authService.createPasswordResetToken(email);
    return Success(res, null, 200, "Нууц үг сэргээх холбоосыг илгээлээ.");
});
export const resetPassword= asyncHandler(async (req, res) => {
    const { token, newPassword } = req.validated.body;
    const data = await authService.resetPassword(token, newPassword);
    return Success(res, null, 200, "Амжилттай өөрчлөгдлөө.")
});
