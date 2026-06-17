import * as customerRepository from "../customers/customer.repository.js";
import * as loansRepository from "../loans/loans.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import * as installmentsRepository from "../installments/installments.repository.js";
import * as paymentsRepository from "../payments/payments.repository.js";
import * as installmentsService from "../installments/installments.service.js";
export async function getProfileData(userId, customerId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new Error("Хэрэглэгчийн бүртгэл олдсонгүй.");
    }
    const customerProfile =await customerRepository.findCustomerProfile(customerId);
    if (!customerProfile) {
        throw new Error("Харилцагчийн мэдээлэл олдсонгүй.");
    }
    return {account: {id: user.id, username: user.username, full_name: user.full_name, email: user.email, phone: user.phone,role: user.role, is_active: user.is_active,}, profile: customerProfile,
    };
}
export async function getMyLoans(id){
    const customer = await customerRepository.findCustomer(id);
    if(!customer){
        throw new Error("Хэрэглэгч олдсонгүй.");
    }
    return await loansRepository.findLoansByCustomerId(id);
}
export async function checkLoanOwnership(customerId, loanId){
    const loan= await loansRepository.findLoan(loanId);
    if(!loan){
        throw new Error("Зээл олдсонгүй.")
    }
    if(loan.customer_id===Number(customerId)){
        return loan;
    }
    throw new Error("Зээл харах эрхгүй байна.");
}
export async function getMyLoanById(customerId, loanId){
    return await checkLoanOwnership(customerId, loanId);
}
export async function getMyLoanInstallments(customerId, loanId){
    const loan= await checkLoanOwnership(customerId, loanId);
    await installmentsService.updateOverdueInstallments(loanId);
    return await installmentsRepository.getInstallmentsByLoanId(loan.id);
}
export async function getMyLoanPayments(customerId, loanId){
    const loan= await checkLoanOwnership(customerId, loanId);
    return await paymentsRepository.findPaymentsByLoanId(loan.id);
}
export async function getMyPayments(customerId){
    return await paymentsRepository.findPaymentByCustomerId(customerId);
}
export async function getDashboardData(customerId){
    const customer=await customerRepository.findCustomer(customerId);
    const loan= await loansRepository.findLoansByCustomerId(customer.id);
    const installments= await installmentsRepository.findUnpaidInstallmentsByLoanId(customer.id);
    const payments= await paymentsRepository.findPaymentsByCustomerId(customer.id);
    const uldegdel= await installmentsRepository.getTotalRemainingAmountByLoanId(loan.id);
    return {dashboardData: {name: customer.first_name, remainingAmount: uldegdel, nextPaymentAmount: installments.total_amount[0], nextPaymentDate: installments.due_date[0], status: loan.loan_status, }} //suuliin gurwan tulult, daraagiin gurwan tulultiig herhen gargah we?
}
makeMyLoanPayment