import express from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import {limitRate, regsiterLimit, passwordChangeLimit} from "../../middlewares/rateLimiting.js"
const router=express.Router();
router.post("/register", regsiterLimit, authController.register);
router.post("/login", limitRate, authController.login); 
router.get("/personal", authMiddleware, authController.getMe); 
router.patch("/password", authMiddleware, passwordChangeLimit, authController.changeMyPassword);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
export default router;
