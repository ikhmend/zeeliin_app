import express from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
const router=express.Router();
// router.post("/register", );
router.post("/login", authController.login);
router.get("/personal", authMiddleware, authController.getMe);
export default router;
