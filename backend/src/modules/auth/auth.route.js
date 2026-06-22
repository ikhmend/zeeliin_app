import express from "express";
import { loginSchema, passwordSchema} from "./auth.validation.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import {limitRate, regsiterLimit, passwordChangeLimit} from "../../middlewares/rateLimiting.js"
const router=express.Router();
router.post("/register", regsiterLimit, authController.register);
router.post("/login", limitRate, validateRequest(loginSchema), authController.login); 
router.get("/personal", authMiddleware, authController.getMe); 
router.patch("/password", passwordChangeLimit, authMiddleware, validateRequest(passwordSchema), authController.changeMyPassword);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
export default router;
