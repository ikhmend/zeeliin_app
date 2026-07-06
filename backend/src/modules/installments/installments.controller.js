import * as installmentsService from "./installments.service.js";
import asyncHandler from "../../utility/asyncHandler.js";
import {Success} from "../../utility/sendResponse.js";
export const getInstallmentsByLoanId = asyncHandler(async (req, res) => {
  const data= await installmentsService.getInstallmentsByLoanId(req.params.loanId);
  return Success(res, data);
});