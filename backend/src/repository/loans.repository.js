import pool from "../config/db.js";
export async function findLoans(){
    const res=await pool.query(`select * from loans order by id desc`);
    return res.rows;
}