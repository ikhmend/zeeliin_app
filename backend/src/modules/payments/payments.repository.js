import { Model, Op } from "sequelize";
import Payment from "../../models/payments.model.js";
import Loan from "../../models/loan.model.js";
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
export async function findPaymentsByCustomerId(customerId) {
  return await Payment.findAll({
    include: [
      {
        model: Loan,
        as: "loan",
        required: true,
        where: {
          customer_id: customerId,
        },
      },
    ],
    order: [["payment_date", "DESC"]],
  });
}
export async function findRecentPaymentsByCustomerId(customerId, limit = 3) {
  return await Payment.findAll({
    include: [
      {
        model: Loan,
        as: "loan",
        required: true,
        where: {
          customer_id: customerId,
        },
      },
    ],
    order: [
      ["payment_date", "desc"],
      ["created_at", "desc"],
    ],
    limit,
  });
}