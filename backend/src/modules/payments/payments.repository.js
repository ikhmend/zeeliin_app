import { Op } from "sequelize";
import Payment from "../../models/payments.model.js";
export async function createPayment(paymentData){
    return await Payment.create(paymentData);
}
export async function findPaymentsByLoanId(loanId){
    return await Payment.findAll({
        where:{
            loan_id: loanId,
        },
        order: [["created_at", "desc"]],
    });
}
export async function findPaymentsByInstallmentId(installmentId){
    return await Payment.findAll({
        where:{
            installment_id:installmentId,
        },
        order:[["created_at", "desc"]],
    });
}
export async function findPaymentById(id){
    return await Payment.findByPk(id);
}