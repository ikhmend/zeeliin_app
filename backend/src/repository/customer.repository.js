import pool from "../config/db.js";
export async function findAllCustomers(){
    const res=await pool.query(`select * from customers order by id desc`);
    return res.rows;
}
export async function findCustomer(id){
    const res=await pool.query(`select * from customers where id=$1`, [id]);
    return res.rows[0];
}
export async function findCustomersWithKeyword(keyword){
    const tulhuur=`%${keyword}%`;
    const res=await pool.query(`select * from customers where register_no ilike $1 or first_name ilike $1 or customer_code ilike $1 or phone::text ilike $1`, [tulhuur]);
    return res.rows;
}
export async function createCustomer(customerData){
    const {register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address}=customerData;
    const res= await pool.query(`insert into customers(register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) returning *`, [register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address]);
    return res.rows[0];
}
export async function updateCustomer(id, customerData){
    const {register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address}=customerData;
    const res= await pool.query(`update customers set register_no=$1, customer_type=$2, customer_code=$3, family_name=$4, last_name=$5, first_name=$6, phone=$7, home_phone=$8, email=$9, social=$10, activity_dir=$11, business_type=$12, education=$13, profession=$14, birth_date=$15, birth_place=$16, official_address=$17, current_address=$18 where id=$19 returning *`, [register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address, id]);
    return res.rows[0];
}
export async function findEmploymentByCustomerId(id){
    const res = await pool.query(`select * from employments where id=$1`, [id]);
    return res.rows[0];
}
export async function findActiveLoansByCustomerId(id){
    const res = await pool.query(`select * from loans where loan_status='active' and customer_id=$1`, [id]);
    return res.rows;
}
export async function findInactiveLoansByCustomerId(id){
    const res = await pool.query(`select * from loans where (loan_status='paid' or loan_status='closed') and customer_id=$1`, [id]);
    return res.rows;
}
export async function findAllInactiveLoans(){
    const res = await pool.query(`select * from loans where (loan_status='paid' or loan_status='closed')`);
    return res.rows;
}
export async function findAllActiveLoans(){
    const res=await pool.query(`select * from loans where loan_status='active'`);
    return res.rows;
}
