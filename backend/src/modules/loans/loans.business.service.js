import * as loansRepository from "./loans.repository.js";
import * as installmentsRepository from "../installments/installments.repository.js";
import AppError from "../../utility/AppError.js";
export async function createLoanWithInstallments(loanData) {
  const {loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, interest_rate,duration_month, created_user_id, updated_user_id, start_date,} = loanData;
  if (!loan_code?.trim() || !contract_no?.trim() || !account_no?.trim() || !customer_id || !branch_id || !loan_product?.trim() || !loan_status?.trim() || !loan_amount || Number(loan_amount) <= 0 || Number(interest_rate) < 0 || !duration_month ||Number(duration_month) <= 0 || !created_user_id || !updated_user_id || !start_date) {
    throw new AppError("Талбар дутуу/буруу бөглөсөн.", 400);
  }
  const createdLoan = await loansRepository.createLoan(loanData);
  const existingInstallments =await installmentsRepository.getInstallmentsByLoanId(createdLoan.id);
  if (existingInstallments.length > 0) {
    throw new AppError("Төлбөрийн хуваарьтай зээл байна.", 409);
  }
  const loanAmount = Number(createdLoan.loan_amount);
  const durationMonth = Number(createdLoan.duration_month);
  const interestRate = Number(createdLoan.interest_rate);
  let remainingPrincipal = loanAmount;
  const monthlyPrincipal = loanAmount / durationMonth;
  const installments = [];
  for (let i = 1; i <= durationMonth; i++) {
    const dueDate = new Date(createdLoan.start_date);
    dueDate.setMonth(dueDate.getMonth() + i);
    const principalAmount = i === durationMonth ? remainingPrincipal : monthlyPrincipal;
    const interestAmount = remainingPrincipal * interestRate / 100;
    const totalAmount = principalAmount + interestAmount;
    installments.push({
      loan_id: createdLoan.id,
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
    remainingPrincipal -=principalAmount;
  }
  const createdInstallments =
    await installmentsRepository.generateInstallments(installments);
  return {
    loan: createdLoan,
    installments: createdInstallments,
  };
}
