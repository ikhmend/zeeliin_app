import express from "express";
import * as loansController from "./loans.controller.js";
import * as installmentsController from "../installments/installments.controller.js";
import * as paymentsController from "../payments/payments.controller.js";
const router = express.Router();
router.get("/", loansController.getLoans); //buh zeel harah, maybe useless
router.post("/", loansController.createLoan); //zeel uusgeh maybe useless
router.get("/:id/installments", installmentsController.getInstallmentsByLoanId); //zeeliin dugaaraar tulburiin huwaari awah 
router.post("/:id/payments", paymentsController.makePayment); //tulult hiih, neg zeeliinh bish
router.get("/:id/payments", paymentsController.getPaymentsByLoanId); //neg zeeliin tulultiin tuuh harah, hariltsagchtai hamaaralgu
router.get("/:id", loansController.getLoan); //neg zeel awah
export default router;