import * as loansRepository from "./loans.repository.js";
import * as installmentsService from "../installments/installments.service.js";
import AppError from "../../utility/AppError.js";
import sequelize from "../../config/sequelize.js";
export async function createLoanWithInstallments(loanData) {
  const {
    loan_code,
    contract_no,
    account_no,
    customer_id,
    branch_id,
    loan_product,
    loan_status,
    loan_amount,
    interest_rate,
    duration_month,
    created_user_id,
    updated_user_id,
    start_date,
  } = loanData;
  if (
    !loan_code?.trim() ||
    !contract_no?.trim() ||
    !account_no?.trim() ||
    !customer_id ||
    !branch_id ||
    !loan_product?.trim() ||
    !loan_status?.trim() ||
    !loan_amount ||
    Number(loan_amount) <= 0 ||
    Number(interest_rate) < 0 ||
    !duration_month ||
    Number(duration_month) <= 0 ||
    !created_user_id ||
    !updated_user_id ||
    !start_date
  ) {
    throw new AppError("Талбар дутуу/буруу бөглөсөн.", 400);
  }
  return sequelize.transaction(async (transaction) => {
    const loan = await loansRepository.createLoan(loanData, transaction);
    const installments = await installmentsService.generateInstallments(
      loan.id,
      transaction,
    );
    return { loan, installments };
  });
}
