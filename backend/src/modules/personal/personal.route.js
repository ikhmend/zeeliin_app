import express from "express";
import * as personalController from "./personal.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { paymentLimit } from "../../middlewares/rateLimiting.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/dashboard", personalController.getDashboard); //dashboard
router.get("/profile", personalController.getProfile); //profile, harah
router.put("/profile", personalController.updateProfile); //profile, medeelel uurchluh
router.get("/payments", personalController.getMyPayments); //hariltsagchiin tulultiin tuuh
router.get("/loans", personalController.getMyLoans); //hariltsagchiin buh zeeluud
router.get("/loans/:loanId/installments",personalController.getMyLoanInstallments); //neg zeeliin tulultiin huwaari
router.get("/loans/:loanId/payments",personalController.getMyLoanPayments); //neg zeeliin tulultiin tuuh
router.post( "/loans/:loanId/payments", paymentLimit, personalController.makeMyPayment); //tulult hiih, neg zeeld
router.get("/loans/:loanId", personalController.getMyLoanById); //neg zeeliin delgerengui
export default router;