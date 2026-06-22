import * as customerRepository from "../customers/customer.repository.js";
import * as loansRepository from "../loans/loans.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import * as installmentsRepository from "../installments/installments.repository.js";
import * as paymentsRepository from "../payments/payments.repository.js";
import * as paymentsService from "../payments/payments.service.js";
import * as installmentsService from "../installments/installments.service.js";
import AppError from "../../utility/AppError.js";
export async function getProfileData(userId, customerId) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new AppError("Хэрэглэгчийн бүртгэл олдсонгүй.", 404);
  }
  const customerProfile =await customerRepository.findCustomerProfile(customerId);
  if (!customerProfile) {
    throw new AppError("Харилцагчийн мэдээлэл олдсонгүй.", 404);
  }
  return {account: {id: user.id, username: user.username, full_name: user.full_name, email: user.email, phone: user.phone,role: user.role, is_active: user.is_active,},
    profile: customerProfile,
  };
}
export async function updateProfile(customerId, customerData) {
  const customer = await customerRepository.findCustomer(customerId);
  if (!customer) {
    throw new AppError("Харилцагчийн мэдээлэл олдсонгүй.", 404);
  }
  const allowedFields = ["phone", "home_phone", "email", "current_address", "social",];
  const updateData = {};
  for (const field of allowedFields) {
    if (customerData[field] !== undefined) {
      updateData[field] = customerData[field];
    }
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError("Шинэчлэх боломжтой мэдээлэл оруулаагүй байна.", 400);
  }
  return await customerRepository.updateCustomer(customerId, updateData);
}
export async function getMyLoans(customerId) {
  const customer = await customerRepository.findCustomer(customerId);
  if (!customer) {
    throw new AppError("Харилцагч олдсонгүй.", 404);
  }
  return await loansRepository.findLoansByCustomerId(customerId);
}
export async function checkLoanOwnership(customerId, loanId) {
  const loan = await loansRepository.findLoan(loanId);
  if (!loan) {
    throw new AppError("Зээл олдсонгүй.", 404);
  }
  if (Number(loan.customer_id) !== Number(customerId)) {
    throw new AppError("Энэ зээлийн мэдээллийг харах эрхгүй байна.", 403);
  }
  return loan;
}
export async function getMyLoanById(customerId, loanId) {
  return await checkLoanOwnership(customerId, loanId);
}
export async function getMyLoanInstallments(customerId, loanId) {
  const loan= await checkLoanOwnership(customerId, loanId);
  await installmentsService.updateOverdueInstallments(loan.id);
  return await installmentsRepository.getInstallmentsByLoanId(loan.id);
}
export async function getMyLoanPayments(customerId, loanId) {
  const loan = await checkLoanOwnership(customerId, loanId);
  return await paymentsRepository.findPaymentsByLoanId(loan.id);
}
export async function getMyPayments(customerId) {
  const customer = await customerRepository.findCustomer(customerId);
  if (!customer){ 
    throw new AppError("Харилцагч олдсонгүй.", 404);
  }
  return await paymentsRepository.findPaymentsByCustomerId(customerId);
}
export async function getDashboardData(customerId) {
  const customer = await customerRepository.findCustomer(customerId);
  if (!customer){
    throw new AppError("Харилцагч олдсонгүй.", 404);
  }
  const loans =await loansRepository.findLoansByCustomerId(customerId);
  const activeLoans = loans.filter((loan) =>["active", "overdue"].includes(loan.loan_status));
  const activeLoanCount = activeLoans.length;
  const recentPayments = await paymentsRepository.findRecentPaymentsByCustomerId(customerId, 3);
  if (activeLoans.length === 0){
    return {dashboardData: {name: customer.first_name, activeLoanCount: 0, totalOutstandingAmount: 0, nextPaymentAmount: null,nextPaymentDate: null,}, recentPayments, upcomingInstallments: [],};
  }
  for (const loan of activeLoans){
    await installmentsService.updateOverdueInstallments(loan.id);
  }
  const remainingAmounts = await Promise.all(
    activeLoans.map((loan) => installmentsRepository.getTotalRemainingAmountByLoanId(loan.id)
    )
  );
  const totalOutstandingAmount = remainingAmounts.reduce((sum, amount)=>sum + Number(amount || 0), 0);
  const upcomingInstallments = await installmentsRepository.findUpcomingInstallmentsByCustomerId(customerId, 3);
  const nextInstallment = upcomingInstallments[0] ?? null;
  return {dashboardData: {name: customer.first_name, activeLoanCount, totalOutstandingAmount, nextPaymentAmount: nextInstallment ? Number(nextInstallment.remaining_amount) : null, nextPaymentDate: nextInstallment ? nextInstallment.due_date : null, }, recentPayments, upcomingInstallments,};
}
export async function makeMyPayment(customerId, loanId, paymentData){
  const loan = await checkLoanOwnership(customerId, loanId);
  return await paymentsService.makePayment(loan.id, paymentData);
}
