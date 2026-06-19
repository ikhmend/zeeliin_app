import * as paymentsService from "./payments.service.js";
import asyncHandler from "../../utility/asyncHandler.js"
import {Success} from "../../utility/sendResponse.js"
export const makePayment= asyncHandler(async (req, res) => {
    const {id}=req.params;
    const data= await paymentsService.makePayment(id, req.body);
    return Success(res, data, 201, "Төлбөр амжилттай хийгдлээ.");
});
export const getPaymentsByLoanId= asyncHandler(async (req, res) => {
    const {id}=req.params;
    const data= await paymentsService.getPaymentsByLoanId(id);
    return Success(res, data);
});
export const getPaymentsByInstallmentId= asyncHandler(async (req, res) => {
    const {id}=req.params;
    const data= await paymentsService.getPaymentsByInstallmentId(id);
    return Success(res, data)
});