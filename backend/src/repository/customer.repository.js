import { Op } from "sequelize";
import Customer from "../models/customer.model.js";
export async function findAllCustomers(){
    return await Customer.findAll({order: [["id", "desc"]],});
}
export async function findCustomer(id){
    return await Customer.findByPk(id);
}
export async function findCustomersWithKeyword(keyword){
    return await Loan.findAll({
        where:{
            [Op.or]:[{
                phone: {
                    [Op.eq]:`%${keyword}%`,
                },
            },
            {
                last_name:{
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            {
                first_name:{
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            {
                register_no:{
                    [Op.iLike]: `%${keyword}%`,
                },
            },
        ],
        },
        order:[["id", "desc"]],
    });
}
export async function createCustomer(customerData){
    return await Customer.create(customerData);
}
export async function updateCustomer(id, customerData){
    const [updatedCount, updatedRows]= await Customer.update(customerData, {
        where:{id},
        returning:true,
    });
    if(updatedCount===0){
        return null;
    }
    return updatedRows[0];
}
//employment table?
