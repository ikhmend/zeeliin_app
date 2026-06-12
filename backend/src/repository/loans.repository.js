import pool from "../config/db.js";
export async function createLoan(loanData){
    const{loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date}=loanData;
    const res=await pool.query(`insert into loans(loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) returning *`, [loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date]);
    return res.rows[0];
}
export async function findLoans(){
    const res=await pool.query(`select * from loans order by id desc`);
    return res.rows;
}
export async function findLoan(id){
    const res=await pool.query(`select * from loans where id=$1`, [id]);
    return res.rows[0];
}
export async function findLoansByCustomerId(customerId) {
  const res = await pool.query(`SELECT *FROM loans WHERE customer_id = $1 ORDER BY created_at DESC`, [customerId]);
  return res.rows;
}
export async function updateLoan(id, loanData){
    const{loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date}=loanData;
    const res=await pool.query(`update loans set loan_code=$1, contract_no=$2, account_no=$3, customer_id=$4, branch_id=$5, loan_product=$6, loan_status=$7, loan_amount=$8, loan_amount_currency=$9, currency=$10, interest_rate=$11, fee_percent=$12, fee_amount=$13, duration_month=$14, grace_period_month=$15, previous_loan_balance=$16, created_user_id=$17, updated_user_id=$18, start_date=$19 where id=$20 returning *`, [loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, updated_user_id, start_date, id]);
    return res.rows[0];
}
export async function updateLoanAfterPayment(id, remainingBalance) {
  const loanStatus = Number(remainingBalance) === 0 ? "paid" :"active";
  const res = await pool.query(`update loans set remaining_balance = $1, loan_status = $2, updated_at =current_timestamp where id = $3 returning *`, [remainingBalance, loanStatus, id]);
  return res.rows[0];
}
export async function findLoansWithKeyword(keyword){
    const tulhuur=`%${keyword}%`;
    const res=await pool.query(`select * from loans where loan_code ilike $1 or contract_no ilike $1 or account_no ilike $1 or customer_id::text ilike $1`, [tulhuur]);
    return res.rows;
}
export async function findActiveLoans(){
    const res= await pool.query(`select * from loans where loan_status in ('active', 'overdue', 'approved') order by created_at desc`);
    return res.rows;
}
export async function findInactiveLoans(){
    const res= await pool.query(`select * from loans where loan_status in ('paid', 'closed', 'inactive', 'cancelled') order by created_at desc`);
    return res.rows;
}
export async function findLoansByProduct(loanProduct){
    const res= await pool.query(`select * from loans where loan_product ilike $1`, [loanProduct]);
    return res.rows;
}