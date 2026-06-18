import * as installmentsService from "./installments.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {Success} from "../../utils/sendResponse.js";
export const getInstallmentsByLoanId = asyncHandler(async (req, res) => {
  const data= await installmentsService.getInstallmentsByLoanId(req.params.loanId);
  return Success(res, data);
});