import Loan from "../../models/loan.model.js";
import { Op } from "sequelize";
export async function createLoan(loanData){
    return await Loan.create(loanData);
}
export async function findLoans(){
    return await Loan.findAll({order : [["id", "desc"]],});

}
export async function findLoan(id){
    return await Loan.findByPk(id);
}
export async function findLoansByCustomerId(customerId) {
    return await Loan.findAll({where: customerId, order: [["created_at", "desc"]],});
}
export async function updateLoan(id, loanData) {
    const [updatedCount, updatedRows] = await Loan.update(loanData, {
        where: { id },
        returning: true,
    });
    if (updatedCount === 0) {
        return null;
    }
    return updatedRows[0];
}
export async function updateLoanAfterPayment(id, updateData) {
  const loan = await Loan.findByPk(id);
  if (!loan) {
    return null;
  }
  return await loan.update(updateData);
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
        {
          loan_product: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        {
          loan_status: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ],
    },
    order: [["id", "DESC"]],
  });
}
export async function findActiveLoans(){
    return await Loan.findAll({
        where: {
            loan_status: {
                [Op.in]: ["active", "approved", "overdue"],
            },
        },
        order: [["created_at", "desc"]],
    });
}
export async function findInactiveLoans(){
    return await Loan.findAll({
        where: {
            loan_status:{
                [Op.in]: ["closed", "paid", "cancelled"],
            },
        },
        order:[["id", "desc"]],
    });
}
export async function findLoansByProduct(loanProduct){
    return await Loan.findAll({
        where: {
            loan_product: loanProduct,
        },
        order:[["created_at", "desc"]],
    });
}
export async function findLoansByProduct(loanProduct){
  return await Loan.findAll({
    where:{
      loan_product: loanProduct,
    },
    order: [["created_at", "desc"]]
  })
}