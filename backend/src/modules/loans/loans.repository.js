import { Op } from "sequelize";
import Loan from "../../models/loan.model.js";
export async function createLoan(loanData) {
  return await Loan.create(loanData);
}
export async function findLoans() {
  return await Loan.findAll({
    order: [["id", "desc"]],
  });
}
export async function findLoan(id,transaction = null){
  return await Loan.findByPk(id, {transaction, lock: transaction ? transaction.LOCK.UPDATE: undefined,
  }); //lock hiij dawhar tulult hiihees hamgaalna, zeeliin mur transaction hiigdej duustal lock hiij huleene
}
export async function updateLoan(id, loanData) {
  const loan = await Loan.findByPk(id);
  if (!loan) {
    return null;
  }
  return await loan.update(loanData);
}
export async function updateLoanAfterPayment(id, updateData, transaction=null) {
  const loan = await Loan.findByPk(id, {transaction,});
  if (!loan) {
    return null;
  }
  return await loan.update(updateData, {transaction,});
}
export async function findLoansByCustomerId(customerId) {
  return await Loan.findAll({
    where: {
      customer_id: customerId,
    },
    order: [["created_at", "desc"]],
  });
}
export async function findLoansByProduct(loanProduct) {
  return await Loan.findAll({
    where: {
      loan_product: loanProduct,
    },
    order: [["created_at", "desc"]],
  });
}
export async function findActiveLoans() {
  return await Loan.findAll({
    where: {
      loan_status: {
        [Op.in]: ["active", "approved", "overdue"],
      },
    },
    order: [["created_at", "desc"]],
  });
}
export async function findInactiveLoans() {
  return await Loan.findAll({
    where: {
      loan_status: {
        [Op.in]: ["paid", "closed", "cancelled"],
      },
    },
    order: [["created_at", "desc"]],
  });
}
export async function findLoansWithKeyword(keyword) {
  return await Loan.findAll({
    where: {
      [Op.or]: [
        {
          loan_code: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        {
          contract_no: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        {
          account_no: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ],
    },
    order: [["id", "DESC"]],
  });
}