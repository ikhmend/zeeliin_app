import express from "express";
import * as loansController from "./loans.controller.js";
import * as installmentsController from "../installments/installments.controller.js";
const router = express.Router();
router.get("/", loansController.getLoans);
router.post("/", loansController.createLoan);
router.get("/:id/installments", installmentsController.getInstallmentsByLoanId);
router.get("/:id", loansController.getLoan);
export default router;