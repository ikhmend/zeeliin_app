import * as personalService from "./personal.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Success } from "../../utils/sendResponse.js";
export const getDashboard = asyncHandler(async (req, res) => {
    const data = await personalService.getDashboardData(req.user.customer_id);
    return Success(res, data);
});
export const getProfile= asyncHandler(async (req, res) => {
    const data= await personalService.getProfileData(req.user.id, req.user.customer_id);
    return Success(res, data);
}); 
export const updateProfile= asyncHandler(async (req, res) => {
    const data= await personalService.updateProfile(req.user.customer_id, req.body);
    return Success(res, data, 200, "Амжилттай шинэчлэгдлээ.");
});
export const getMyLoans= asyncHandler(async (req, res) => {
    const data= await personalService.getMyLoans(req.user.customer_id);
    return Success(res, data);
});
export const getMyLoanById= asyncHandler(async(req, res)=>{
    const data= await personalService.getMyLoanById(req.user.customer_id, req.params.loanId);
    return Success(res, data);
});
export const getMyLoanInstallments = asyncHandler(async (req, res) => {
    const data= await personalService.getMyLoanInstallments(req.user.customer_id, req.params.loanId);
    return Success(res, data);
});
export const getMyLoanPayments= asyncHandler(async (req, res) => {
    const data= await personalService.getMyLoanPayments(req.user.customer_id, req.params.loanId);
    return Success(res, data);
});
export const getMyPayments= asyncHandler(async (req, res) => {
    const data= await personalService.getMyPayments(req.user.customer_id);
    return Success(res, data);
});
export const makeMyPayment= asyncHandler(async (req, res) => {
    const data= await personalService.makeMyPayment(req.user.customer_id, req.params.loanId, req.body);
    return Success(res, data, 201, "Төлөлт амжилттай.");
});