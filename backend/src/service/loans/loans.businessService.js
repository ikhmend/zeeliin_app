import * as loansRepository from "../../repository/loans.repository.js";
import * as installmentsRepository from "../../repository/installments.repository.js";
import * as installmentsService from "../installments.service.js";
export async function createLoan(loanData){
    const{loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date}=loanData;
    if(!loan_code?.trim() || !contract_no?.trim() || !account_no?.trim() || !customer_id|| !branch_id || !loan_product?.trim() || !loan_status?.trim() || !created_user_id || !updated_user_id || !start_date){
        throw new Error("Талбар дутуу бөглөсөн.");
    }
    const createdLoan = await loansRepository.createLoan(loanData);
    const installments = await installmentsService.generateInstallments(createdLoan.id);
    return {loan: createdLoan, installments,};
}