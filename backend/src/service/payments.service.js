import * as loansRepository from "../repository/loans.repository.js";
import * as installmentsRepository from "../repository/installments.repository.js";

export async function updatePayments(id, paymentData) {
  const loan = await loansRepository.findLoan(id);
  const { payment_amount, payment_date, payment_method } = paymentData;
  if (!loan) {
    throw new Error("Зээл байхгүй байна.");
  }
  if (loan.loan_status === "closed" || loan.loan_status === "paid") {
    throw new Error("Төлөгдсөн зээл байна.");
  }
  if (!payment_amount ||Number(payment_amount) <= 0 ||!payment_date ||!payment_method?.trim()) {
    throw new Error("Алдаатай төлөлт.");
  }
  const unpaidInstallments =await installmentsRepository.findUnpaidInstallmentsByLoanId(loan.id);
  if (unpaidInstallments.length === 0) {
    throw new Error("Төлөх хуваарь олдсонгүй.");
  }
  const paidInstallments = [];
  let paymentLeft = Number(payment_amount);
  let i = 0;
  while (i < unpaidInstallments.length && paymentLeft > 0) {
    const installment = unpaidInstallments[i];
    const remainingAmount = Number(installment.remaining_amount);
    if (remainingAmount <= paymentLeft) {
      const payForInstallment = remainingAmount;
      const updateData = {remaining_amount: 0, status: "paid", paid_date: payment_date,};
      const updatedInstallment = await installmentsRepository.updateInstallmentPayment( installment.id, updateData);
      paidInstallments.push(updatedInstallment);
      paymentLeft = paymentLeft-payForInstallment;
    } else {
      const payForInstallment = paymentLeft;
      const updateData = {remaining_amount: remainingAmount- payForInstallment, status: "partial", paid_date: null,};
      const updatedInstallment =await installmentsRepository.updateInstallmentPayment(installment.id, updateData);
      paidInstallments.push(updatedInstallment);
      paymentLeft = 0;
    }
    i++;
  }
  const totalRemaining =await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id);
  const loanStatus = Number(totalRemaining) === 0 ? "paid" : "active";
  const updatedLoan = await loansRepository.updateLoanAfterPayment(loan.id, { loan_status: loanStatus});
  return {paidInstallments,updatedLoan,};
}