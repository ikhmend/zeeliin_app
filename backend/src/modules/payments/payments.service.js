import * as loansRepository from "../loans/loans.repository.js";
import * as installmentsRepository from "../installments/installments.repository.js";
import * as paymentsRepository from "./payments.repository.js";
import * as installmentService from "../installments/installments.service.js"
import AppError from "../../utils/AppError.js";
export async function makePayment(id, paymentData) {
  const loan = await loansRepository.findLoan(id);
  const { payment_amount, payment_date, payment_method, received_user_id, note } = paymentData;
  if (!loan) {
    throw new AppError("Зээл байхгүй байна.", 404);
  }
  if (loan.loan_status === "closed" || loan.loan_status === "paid") {
    throw new AppError("Төлөгдсөн зээл байна.", 400);
  }
  await installmentService.updateOverdueInstallments(id);
  if (!payment_amount ||Number(payment_amount) <= 0 ||!payment_date ||!payment_method?.trim()) {
    throw new AppError("Алдаатай төлөлт.", 400);
  }
  const unpaidInstallments =await installmentsRepository.findUnpaidInstallmentsByLoanId(loan.id);
  if (unpaidInstallments.length === 0) {
    throw new AppError("Төлөх хуваарь олдсонгүй.", 404);
  }
  const niitUldsen=await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id);
  if(payment_amount >niitUldsen){
    throw new AppError("Зээлийн үлдэгдлээс их дүнгээр төлөлт хийх боломжгүй", 400);
  }
  const payments=[];
  const paidInstallments = [];
  let paymentLeft = Number(payment_amount);
  let i = 0;
  while (i < unpaidInstallments.length && paymentLeft > 0) {
    const installment = unpaidInstallments[i];
    const remainingAmount = Number(installment.remaining_amount);
    if (remainingAmount <= paymentLeft) {
      const payForInstallment = remainingAmount;
      const updateData = {remaining_amount: 0, status: "paid", paid_date: payment_date, paid_amount: Number(installment.paid_amount || 0) + payForInstallment,};
      const updatedInstallment = await installmentsRepository.updateInstallmentPayment( installment.id, updateData);
      const updatePayment= {loan_id: loan.id, installment_id: installment.id, payment_amount: payForInstallment, payment_date: payment_date, payment_method: payment_method, received_user_id: received_user_id|| null, note: note ||""}
      const createdPayment=await paymentsRepository.createPayment(updatePayment);
      payments.push(createdPayment);
      paidInstallments.push(updatedInstallment);
      paymentLeft = paymentLeft-payForInstallment;
    } else {
      const payForInstallment = paymentLeft;
      const updateData = {remaining_amount: remainingAmount- payForInstallment, status: "partial", paid_date: null, paid_amount: Number(installment.paid_amount || 0) + payForInstallment,};
      const updatedInstallment =await installmentsRepository.updateInstallmentPayment(installment.id, updateData);
      const updatePayment= {loan_id: loan.id, installment_id: installment.id, payment_amount: payForInstallment, payment_date: payment_date, payment_method: payment_method, received_user_id: received_user_id|| null, note: note ||""}
      const createdPayment=await paymentsRepository.createPayment(updatePayment);
      payments.push(createdPayment);
      paidInstallments.push(updatedInstallment);
      paymentLeft = 0;
    }
    i++;
  }
  const totalRemaining =await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id);
  const loanStatus = Number(totalRemaining) === 0 ? "paid" : "active";
  const updatedLoan = await loansRepository.updateLoanAfterPayment(loan.id, { loan_status: loanStatus});
  return {paidInstallments, payments, updatedLoan,};
}
export async function getPaymentsByLoanId(loanId) {
  return await paymentsRepository.findPaymentsByLoanId(loanId);
}
export async function getPaymentsByInstallmentId(installmentId) {
  return await paymentsRepository.findPaymentsByInstallmentId(installmentId);
}