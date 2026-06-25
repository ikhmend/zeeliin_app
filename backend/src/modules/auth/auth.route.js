import express from "express";
import { loginSchema, passwordSchema, forgotPasswordSchema, resetPasswordSchema} from "./auth.validation.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import {limitRate, regsiterLimit, passwordChangeLimit, forgotPasswordEmailLimiter, forgotPasswordIpLimiter, resetPasswordLimiter} from "../../middlewares/rateLimiting.js"
const router=express.Router();
router.post("/register", regsiterLimit, authController.register);
router.post("/login", limitRate, validateRequest(loginSchema), authController.login); 
router.get("/personal", authMiddleware, authController.getMe); 
router.patch("/password", passwordChangeLimit, authMiddleware, validateRequest(passwordSchema), authController.changeMyPassword);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", forgotPasswordIpLimiter, validateRequest(forgotPasswordSchema), forgotPasswordEmailLimiter,  authController.forgotPassword);
router.post("/reset-password", resetPasswordLimiter, validateRequest(resetPasswordSchema), authController.resetPassword);
export default router;
