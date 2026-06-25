import * as loansRepository from "../loans/loans.repository.js";
import * as installmentsRepository from "../installments/installments.repository.js";
import * as paymentsRepository from "./payments.repository.js";
import * as installmentService from "../installments/installments.service.js"
import AppError from "../../utility/AppError.js";
import sequelize from "../../config/sequelize.js";
import { mapInstallment, mapPayment } from "./payments.mapper.js";
export async function makePayment(id, paymentData) {
  const {payment_amount, payment_method, received_user_id,note,} = paymentData;
  const paymentAmount = Number(payment_amount);
  const paymentDate = new Date();
  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0 || !payment_method?.trim()){
    throw new AppError("Алдаатай төлөлт.", 400);
  }
  return await sequelize.transaction(async (transaction) => {
    const loan = await loansRepository.findLoan(id, transaction);
    if (!loan){
      throw new AppError("Зээл байхгүй байна.", 404);
    }
    if (loan.loan_status === "closed" || loan.loan_status === "paid"){
      throw new AppError("Төлөгдсөн зээл байна.", 400);
    }
    await installmentService.updateOverdueInstallments(loan.id,transaction);
    const unpaidInstallments = await installmentsRepository.findUnpaidInstallmentsByLoanId(loan.id, transaction);
    if (unpaidInstallments.length === 0) {
      throw new AppError("Төлөх хуваарь олдсонгүй.", 404);
    }
    const niitUldsen = await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id, transaction);
    if (paymentAmount > Number(niitUldsen)) {
      throw new AppError("Зээлийн үлдэгдлээс их дүнгээр төлөлт хийх боломжгүй.", 400);
    }
    const payments = [];
    const paidInstallments = [];
    let paymentLeft = paymentAmount;
    let i = 0;
    while (i < unpaidInstallments.length && paymentLeft > 0){
      const installment = unpaidInstallments[i];
      const remainingAmount = Number(installment.remaining_amount);
      const payForInstallment = Math.min(remainingAmount, paymentLeft);
      const isFullyPaid =payForInstallment === remainingAmount;
      const updateData = {remaining_amount:remainingAmount - payForInstallment, status: isFullyPaid ? "paid" : "partial",paid_date: isFullyPaid ? paymentDate: null, paid_amount: Number(installment.paid_amount || 0) + payForInstallment,
      };
      const updatedInstallment = await installmentsRepository.updateInstallmentPayment(installment.id, updateData, transaction);
      const newPayment = {loan_id: loan.id, installment_id: installment.id,payment_amount: payForInstallment, payment_date: paymentDate, payment_method: payment_method.trim(), received_user_id: received_user_id || null, note: note?.trim() || "",};
      const createdPayment = await paymentsRepository.createPayment(newPayment, transaction);
      paidInstallments.push(updatedInstallment);
      payments.push(createdPayment);
      paymentLeft -= payForInstallment;
      i++;
    }
    const totalRemaining =await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id, transaction);
    const loanStatus = Number(totalRemaining) === 0 ? "paid" : "active";
    const updatedLoan = await loansRepository.updateLoanAfterPayment(loan.id,{loan_status: loanStatus,}, transaction);
    return {paidInstallments, payments, updatedLoan,};
  });
}
export async function getPaymentsByLoanId(loanId) {
  const payments= await paymentsRepository.findPaymentsByLoanId(loanId);
  return payments.map(mapPayment);
}
export async function getPaymentsByInstallmentId(installmentId) {
  const payments= await paymentsRepository.findPaymentsByInstallmentId(installmentId);
  return payments.map(mapPayment);
}