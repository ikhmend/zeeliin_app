import pool from "../config/db.js";
export async function getInstallmentsByLoanId(id){
    const res= await pool.query(`select * from installments where loan_id=$1`, [id]);
    return res.rows;
}
export async function generateInstallments(installments) {
  const createdInstallments = [];
  for (const installment of installments) {
    const {loan_id, installment_no, due_date, principal_amount, interest_amount, total_amount, remaining_amount, status, paid_date, paid_amount, }= installment;
    const res = await pool.query(`insert into installments (loan_id, installment_no, due_date, principal_amount, interest_amount, total_amount, remaining_amount, status, paid_date, paid_amount) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,[loan_id, installment_no,due_date, principal_amount, interest_amount, total_amount, remaining_amount, status, paid_date, paid_amount,]);
    createdInstallments.push(res.rows[0]);
  }
  return createdInstallments;
}
export async function updateInstallments(installmentData){
  const {loan_id, installment_no, due_date, principal_amount, interest_amount, remaining_amount, status, paid_date, paid_amount}=installmentDate;
  const res=await pool.query(`update installments set `)
}