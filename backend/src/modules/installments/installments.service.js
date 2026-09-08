import AppError from "../../utility/AppError.js";
import * as loansRepository from "../loans/loans.repository.js";
import * as installmentsRepository from "./installments.repository.js";
function roundTo(value) {
  return Math.round(Number(value) * 100) / 100;
}
export function addMonthsClamped(dateOnly, months) {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month + months, 0)).getUTCDate();
  return new Date(Date.UTC(year, month - 1 + months, Math.min(day, lastDay)))
    .toISOString()
    .slice(0, 10);
}
export async function getInstallmentsByLoanId(loanId) {
  const loan = await loansRepository.findLoan(loanId);
  if (!loan) {
    throw new AppError("Ийм дугаартай зээл байхгүй байна.", 404);
  }
  await updateOverdueInstallments(loanId);
  return await installmentsRepository.getInstallmentsByLoanId(loanId);
}
export async function generateInstallments(loanId, transaction = null) {
  const loan = await loansRepository.findLoan(loanId, transaction);
  if (!loan) {
    throw new AppError("Зээл олдсонгүй.", 404);
  }
  const existingInstallments =
    await installmentsRepository.getInstallmentsByLoanId(loanId, transaction);
  if (existingInstallments.length > 0) {
    throw new AppError("Энэ зээл төлбөрийн хуваарьтай байна.", 409);
  }
  const loanAmount = Number(loan.loan_amount);
  const durationMonth = Number(loan.duration_month);
  const interestRate = Number(loan.interest_rate);
  const startDate = loan.start_date;
  if (
    !loanAmount ||
    loanAmount <= 0 ||
    !durationMonth ||
    durationMonth <= 0 ||
    interestRate < 0 ||
    !startDate
  ) {
    throw new AppError(
      "Төлбөрийн хуваарь үүсгэхэд шаардлагатай мэдээлэл бүрэн биш байна.",
      400,
    );
  }
  let remainingPrincipal = loanAmount;
  const monthlyPrincipal = roundTo(loanAmount / durationMonth);
  const installments = [];
  for (let i = 1; i <= durationMonth; i++) {
    const dueDate = addMonthsClamped(startDate, i);
    const principalAmount =
      i === durationMonth ? roundTo(remainingPrincipal) : monthlyPrincipal;
    const interestAmount = roundTo((remainingPrincipal * interestRate) / 100);
    const totalAmount = roundTo(principalAmount + interestAmount);
    installments.push({
      loan_id: loan.id,
      installment_no: i,
      due_date: dueDate,
      principal_amount: principalAmount,
      interest_amount: interestAmount,
      total_amount: totalAmount,
      remaining_amount: totalAmount,
      status: "pending",
      paid_date: null,
      paid_amount: 0,
    });
    remainingPrincipal = roundTo(remainingPrincipal - principalAmount);
  }
  return await installmentsRepository.createInstallments(
    installments,
    transaction,
  );
}
export async function updateOverdueInstallments(loanId, transaction = null) {
  const loan = await loansRepository.findLoan(loanId, transaction);
  if (!loan) {
    throw new AppError("Зээл олдсонгүй.", 404);
  }
  const today = new Date().toISOString().split("T")[0];
  const updated = await installmentsRepository.markOverdue(
    loanId,
    today,
    transaction,
  );
  if (updated.length && !["paid", "closed"].includes(loan.loan_status)) {
    await loansRepository.updateLoanAfterPayment(
      loanId,
      { loan_status: "overdue" },
      transaction,
    );
  }
  return updated;
}
