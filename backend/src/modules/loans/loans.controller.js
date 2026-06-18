import * as loansCrudService from "./loans.Crud.service.js";
import * as loansBusinessService from "./loans.business.service.js";
import * as installmentsService from "../installments/installments.service.js"
import asyncHandler from "../../utils/asyncHandler.js";
import {Success} from "../../utils/sendResponse.js";
export const getLoans= asyncHandler(async (req, res) => {
  const loans= await loansCrudService.getLoans();
  return Success(res, loans);
});
export const getLoan= asyncHandler(async (req, res) => {
  const data= await loansCrudService.getLoan(req.params.loanId);
  return Success(res, data);
});
export const createLoan= asyncHandler(async (req, res) => {
  const data= await loansBusinessService.createLoanWithInstallments(req.body);
  return Success(res, data, 201, "Зээл амжилттай үүслээ.");
});
export const getInstallmentsByLoanId= asyncHandler(async (req, res) => {
  const installments= await installmentsService.getInstallmentsByLoanId(req.params.loanId);
  return Success(res, installments);
});