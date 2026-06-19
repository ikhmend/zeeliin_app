import AppError from "../../utility/AppError.js";
import * as loansRepository from "./loans.repository.js";
export async function createLoan(loanData) {
  const {loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, interest_rate, duration_month, created_user_id, updated_user_id, start_date,} = loanData;
  if (!loan_code?.trim() || !contract_no?.trim() || !account_no?.trim() || !customer_id || !branch_id || !loan_product?.trim() || !loan_status?.trim() || !loan_amount || Number(loan_amount) <= 0 || Number(interest_rate) < 0 || !duration_month || Number(duration_month) <= 0 ||!created_user_id || !updated_user_id || !start_date) {
    throw new AppError("Талбар дутуу эсвэл буруу бөглөсөн.", 400);
  }
  return await loansRepository.createLoan(loanData);
}
export async function getLoans() {
  return await loansRepository.findLoans();
}
export async function getLoan(id) {
  const loan = await loansRepository.findLoan(id);
  if (!loan) {
    throw new AppError("Зээл байхгүй байна.", 404);
  }
  return loan;
}
export async function updateLoan(id, loanData) {
  const loan = await loansRepository.findLoan(id);
  if (!loan) {
    throw new AppError("Зээл байхгүй байна.", 404);
  }
  return await loansRepository.updateLoan(id, loanData);
}

export async function searchLoans(keyword) {
  if (!keyword?.trim()) {
    throw new AppError("Хайх түлхүүр үг оруулна уу.", 400);
  }
  return await loansRepository.findLoansWithKeyword(keyword);
}
export async function getLoansByCustomerId(customerId) {
  if (!customerId) {
    throw new AppError("Харилцагчийн дугаар байхгүй байна.", 404);
  }
  return await loansRepository.findLoansByCustomerId(customerId);
}

export async function getLoansByProduct(loanProduct) {
  if (!loanProduct?.trim()) {
    throw new AppError("Зээлийн бүтээгдэхүүн оруулна уу.", 400);
  }
  return await loansRepository.findLoansByProduct(loanProduct);
}
export async function getActiveLoans() {
  return await loansRepository.findActiveLoans();
}
export async function getInactiveLoans() {
  return await loansRepository.findInactiveLoans();
}
export async function updateLoanAfterPayment(id, updateData) {
  const loan = await loansRepository.findLoan(id);
  if (!loan) {
    throw new AppError("Зээл байхгүй байна.", 404);
  }
  return await loansRepository.updateLoanAfterPayment(id, updateData);
}