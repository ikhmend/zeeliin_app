import * as loansRepository from "../repository/loans.repository.js";
import * as installmentsRepository from "../repository/installments.repository.js";
import * as customerRepository from "../repository/customer.repository.js"
export async function createLoan(loanData){
    const{loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date}=loanData;
    if(!loan_code?.trim() || !contract_no || !account_no?.trim() || !customer_id|| !branch_id || !loan_product?.trim() || !loan_status?.trim() || !created_user_id || !updated_user_id || !start_date){
        throw new Error("Талбар дутуу бөглөсөн.");
    }
    return await loansRepository.createLoan(loanData);
}
export async function getLoans(){
    return await loansRepository.findLoans();
}
export async function getLoan(id){
    return await loansRepository.findLoan(id);
}
export async function updateLoan(id, loanData){
    const loan= await loansRepository.getLoan(id);
    if(!loan){
        throw new Error("Зээл байхгүй байна.");
    }
    return await loansRepository.updateLoan(id, loanData)
}
export async function updateLoanAfterPayment(id, remainingBalance) {
    const loan = await loansRepository.getLoan(id);
    if (!loan){
        throw new Error("Зээл байхгүй байна.");
    }
    if (remainingBalance<0) {
        throw new Error("Зээлийн үлдэгдэл буруу байна.");
    }
  return await loansRepository.updateLoanAfterPayment(id, remainingBalance);
}
export async function searchLoans(keyword){
    return await loansRepository.findLoansWithKeyword(keyword);
}
export async function getLoansByCustomerId(customerId){
    const customer= await customerRepository.findCustomer(customerId);
    if(!customer){
        throw new Error("харилцагч байхгүй байна.");
    }
    return await loansRepository.findLoansByCustomerId(customerId);
}
export async function getActiveLoans(){
    return await loansRepository.findActiveLoans();
}
export async function getInactiveLoans(){
    return await loansRepository.findInactiveLoans();
}
export async function getLoansByProduct(loanProduct) {
  if (!loanProduct?.trim()) {
    throw new Error("Зээлийн бүтээгдэхүүн оруулна уу.");
  }
  return await loansRepository.findLoansByProduct(loanProduct);
}