import * as customerRepository from "../repository/customer.repository.js";
export async function getAllCustomers() {
  return await customerRepository.findAllCustomers();
}
export async function getCustomer(id){
    return await customerRepository.findCustomer(id);
}
export async function getCustomerWithKeyword(keyword){
    return await customerRepository.findCustomersWithKeyword(keyword);
}
export async function createCustomer(customerData){
    const {register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address}=customerData;
    if(!register_no?.trim() || !first_name?.trim() || !phone?.trim() ||!current_address?.trim() || !birth_date){
        throw new Error("Заавал бөглөх талбар дутуу.");
    }
    return await customerRepository.createCustomer(customerData);
}
export async function updateCustomer(id, customerData){
    const {register_no, customer_type, customer_code, family_name, last_name, first_name, phone, home_phone, email, social, activity_dir, business_type, education, profession, birth_date, birth_place, official_address, current_address}=customerData;
    const customer = await customerRepository.findCustomer(id);
    if(!customer){
        throw new Error("Харилцагч байхгүй байна.");
    }
    else if(!register_no?.trim() || !first_name?.trim() || !phone?.trim() ||!current_address?.trim() || !birth_date){
        throw new Error("Заавал бөглөх талбар дутуу.");
    }
    return await customerRepository.updateCustomer(id, customerData);
}
export async function getCustomerProfile(id){
    const customer= await customerRepository.findCustomer(id);
    const employment=await customerRepository.findEmploymentByCustomerId(id);
    const activeLoans= await customerRepository.findActiveLoansByCustomerId(id);
    const inactiveLoans= await customerRepository.findInactiveLoansByCustomerId(id);
    return {customer, employment, activeLoans, inactiveLoans};
}
export async function getCustomersActiveLoans(id){
    const customer= await customerRepository.findCustomer(id);
    if(!customer){
        throw new Error("Харилцагч олдсонгүй.");
    }
    return await customerRepository.findActiveLoansByCustomerId(id);
}
export async function getCustomersInactiveLoans(id){
    const customer= await customerRepository.findCustomer(id);
    if(!customer){
        throw new Error("Харилцагч олдсонгүй.");
    }
    return await customerRepository.findInactiveLoansByCustomerId(id);
}
export async function getAllActiveLoans(){
    return await customerRepository.findAllActiveLoans();
}
export async function getAllInactiveLoans(){
    return await customerRepository.findAllInactiveLoans();
}
