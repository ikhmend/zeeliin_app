import AppError from "../../utility/AppError.js";
import * as loansRepository from "../loans/loans.repository.js";
import * as installmentsRepository from "./installments.repository.js";
function roundTo(value) {
  return Math.round(Number(value)*100)/100;
}
export async function getInstallmentsByLoanId(loanId) {
  const loan = await loansRepository.findLoan(loanId);
  if (!loan) {
    throw new AppError("Ийм дугаартай зээл байхгүй байна.", 404);
  }
  await updateOverdueInstallments(loanId);
  return await installmentsRepository.getInstallmentsByLoanId(loanId);
}
export async function generateInstallments(loanId) {
  const loan = await loansRepository.findLoan(loanId);
  if (!loan) {
    throw new AppError("Зээл олдсонгүй.", 404);
  }
  const existingInstallments =await installmentsRepository.getInstallmentsByLoanId(loanId);
  if (existingInstallments.length > 0) {
    throw new AppError("Энэ зээл төлбөрийн хуваарьтай байна.", 409);
  }
  const loanAmount = Number(loan.loan_amount);
  const durationMonth = Number(loan.duration_month);
  const interestRate = Number(loan.interest_rate);
  const startDate = loan.start_date;
  if (!loanAmount || loanAmount <= 0 || !durationMonth || durationMonth <= 0 || interestRate < 0 ||!startDate) {
    throw new AppError("Төлбөрийн хуваарь үүсгэхэд шаардлагатай мэдээлэл бүрэн биш байна.", 400);
  }
  let remainingPrincipal = loanAmount;
  const monthlyPrincipal = roundTo(loanAmount / durationMonth);
  const installments = [];
  for (let i = 1; i <= durationMonth; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    const principalAmount =i === durationMonth ? roundTo(remainingPrincipal) : monthlyPrincipal;
    const interestAmount = roundTo((remainingPrincipal * interestRate) / 100);
    const totalAmount = roundTo(principalAmount + interestAmount);
    installments.push({
      loan_id: loan.id,
      installment_no: i,
      due_date: dueDate.toISOString().split("T")[0],
      principal_amount: principalAmount,
      interest_amount: interestAmount,
      total_amount: totalAmount,
      remaining_amount: totalAmount,
      status: "pending",
      paid_date: null,
      paid_amount: 0,
    });
    remainingPrincipal= roundTo(remainingPrincipal - principalAmount);
  }
  return await installmentsRepository.createInstallments(installments);
}
export async function updateOverdueInstallments(loanId) {
  const loan = await loansRepository.findLoan(loanId);
  if (!loan) {
    throw new AppError("Зээл олдсонгүй.", 404);
  }
  const unuudur = new Date().toISOString().split("T")[0];
  return await installmentsRepository.markOverdue(loanId, unuudur);
}