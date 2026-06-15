import * as loansRepository from "../../repository/loans.repository.js";
import * as customerRepository from "../../repository/customer.repository.js";
export async function getLoans(){
    return await loansRepository.findLoans();
}
export async function getLoan(id){
    return await loansRepository.findLoan(id);
}
export async function updateLoan(id, loanData){
    const loan= await loansRepository.findLoan(id);
    if(!loan){
        throw new Error("Зээл байхгүй байна.");
    }
    return await loansRepository.updateLoan(id, loanData)
}
export async function updateLoanAfterPayment(id, remainingBalance) {
    const loan = await loansRepository.findLoan(id);
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