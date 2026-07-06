import { Op } from "sequelize";
import Installment from "../../models/installments.model.js";
import Loan from "../../models/loan.model.js";
export async function getInstallmentsByLoanId(loanId) {
  return await Installment.findAll({
    where: {
      loan_id: loanId,
    },
    order: [["installment_no", "asc"]],
  });
}
export async function getInstallmentsByCustomerId(customerId) {
  return await Installment.findAll({
    where: {
      customer_id: customerId,
    },
    order: [["installment_no", "asc"]],
  });
}
export async function createInstallments(installments) {
  return await Installment.bulkCreate(installments, {
    returning: true,
  });
}
export async function findUnpaidInstallmentsByLoanId(loanId, transaction=null){
  return await Installment.findAll({
    where: {
      loan_id: loanId,
      remaining_amount: {
        [Op.gt]: 0,
      },
      status: {
        [Op.in]: ["pending", "partial", "overdue"],
      },
    },
    order: [["installment_no", "asc"]],
    transaction, lock: transaction ? transaction.LOCK.UPDATE : undefined
  });
}
export async function updateInstallmentPayment(id, updateData, transaction= null) {
  const installment = await Installment.findByPk(id, {transaction});
  if (!installment) {
    return null;
  }
  return await installment.update(updateData, {transaction});
}
export async function getTotalRemainingAmountByLoanId(loanId, transaction=null){
  const totalRemaining = await Installment.sum("remaining_amount", {
    where: {
      loan_id: loanId,
    },
    transaction,
  });
  return Number(totalRemaining || 0);
}
export async function markOverdue(loanId, today, transaction=null) {
  const [updatedCount, updatedRows] = await Installment.update(
    {status: "overdue",},
    {where: {
        loan_id: loanId,
        due_date: {
          [Op.lt]: today,
        },
        remaining_amount: {
          [Op.gt]: 0,
        },
        status: {
          [Op.in]: ["pending", "partial"],
        },
      },
      returning: true,
      transaction,
    }
  );
  return updatedRows;
}
export async function findNextInstallmentsByLoanId(loanId, limit = 3) {
  return await Installment.findAll({
    where: {
      loan_id: loanId,
      remaining_amount: {
        [Op.gt]: 0,
      },
      status: {
        [Op.in]: ["pending", "partial", "overdue"],
      },
    },
    order: [["due_date", "asc"]],
    limit,
  });
}
export async function findUpcomingInstallmentsByCustomerId(customerId,limit = 3){
  return await Installment.findAll({
    attributes: ["due_date", "remaining_amount",],
    where: {
      remaining_amount: {
        [Op.gt]: 0,
      },
      status: {
        [Op.in]: ["pending", "partial", "overdue"],
      },
    },
    include: [
      {
        model: Loan,
        as: "loan",
        required: true,
        attributes: [],
        where: {
          customer_id: customerId,
          loan_status: {
            [Op.in]: ["active", "overdue"],
          },
        },
      },
    ],
    order: [
      ["due_date", "ASC"],
      ["id", "ASC"],
    ],
    limit,
  });
}