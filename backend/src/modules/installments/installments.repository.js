import { Op } from "sequelize";
import Installment from "../../models/installments.model.js";
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
export async function findUnpaidInstallmentsByLoanId(loanId) {
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
    order: [["installment_no", "ASC"]],
  });
}
export async function updateInstallmentPayment(id, updateData) {
  const installment = await Installment.findByPk(id);

  if (!installment) {
    return null;
  }
  return await installment.update(updateData);
}
export async function getTotalRemainingAmountByLoanId(loanId) {
  const totalRemaining = await Installment.sum("remaining_amount", {
    where: {
      loan_id: loanId,
    },
  });
  return Number(totalRemaining || 0);
}
export async function markOverdue(loanId, today) {
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
    }
  );

  return updatedRows;
}