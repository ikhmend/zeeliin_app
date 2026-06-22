import * as authService from "./auth.service.js"
import asyncHandler from "../../utility/asyncHandler.js";
import {Success} from "../../utility/sendResponse.js";
import cookieParser from "cookie-parser";
export const getMe= asyncHandler(async (req, res) => {
    const data= await authService.getMe(req.user.id);
    return Success(res, data);
});
export const login= asyncHandler(async (req, res) => {
    const data= await authService.login(req.validated.body);
    res.cookie("refreshToken", data.rtoken, {
        httpOnly:true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV==="production"? "none" : "lax", maxAge: 7*24*60*60*1000, path: "/api/auth"
    });
    return Success(res, {token: data.token, user:data.user}, 200, "Амжилттай нэвтэрлээ.");
});
export const register= asyncHandler(async (req, res) => {
    const data= await authService.register(req.body);
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
    res.clearCookie("refreshToken", {httpOnly: true,secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/api/auth",});
    return Success(res,null, 200, "Амжилттай гарлаа.");
  }
);