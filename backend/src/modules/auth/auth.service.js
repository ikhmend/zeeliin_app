import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import * as customerRepository from "../customers/customer.repository.js"
import sequelize from "../../config/sequelize.js";
import AppError from "../../utils/AppError.js";
export async function login(loginData) {
    const {login, password} = loginData;
    if (!login?.trim() || !password?.trim()){
        throw new AppError("Нэвтрэх нэр болон нууц үг оруулна уу.", 400);
    }
    const user = await authRepository.findUserByLogin(login);
    if (!user){
        throw new AppError("Хэрэглэгч олдсонгүй.", 404);
    }
    if (!user.is_active){
        throw new AppError("Идэвхгүй хэрэглэгч байна.", 400);
    }
    const correctPass = await bcrypt.compare(password, user.password_hash);
    if (!correctPass){
        throw new AppError("Нууц үг буруу байна.", 400);
    }
    const token = jwt.sign({id: user.id, customer_id: user.customer_id, role: user.role,}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1h",});
    return {token, user: {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role,},
    };
}
export async function getMe(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new AppError("Хэрэглэгч олдсонгүй.", 404);
    }
    return {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email,phone: user.phone, role: user.role, is_active: user.is_active,};
}
export async function register(data){
    const {first_name, last_name, register_no, birth_date, phone, email, username, pass, repass}= data;
    if(!first_name?.trim() || !last_name?.trim() || !Number(phone) || !email?.trim() || !username?.trim() || !pass?.trim() || !repass?.trim() || !register_no?.trim() || !birth_date){
        throw new AppError("Талбарыг бүрэн бөглөнө үү", 400);
    }
    if (pass !== repass){
        throw new AppError("Нууц үг таарахгүй байна", 400);
    }
    if (pass.length<8){
        throw new AppError("Нууц үг 8-аас дээш тэмдэгттэй байх ёстой.", 400)
    }
    const imeel1= email.trim().toLowerCase();
    const utas1= phone.trim();
    const ner1= username.trim().toLowerCase();
    const regno= register_no.trim().toUpperCase();
    const imeel= await authRepository.findUserByUnique(imeel1);
    if (imeel){
        throw new AppError("Бүртгэлтэй и-мейл байна.", 409);
    }
    const utas= await authRepository.findUserByUnique(utas1);
    if (utas){
        throw new AppError("Бүртгэлтэй утасны дугаар байна.", 409);
    }
    const ner= await authRepository.findUserByUnique(ner1);
    if (ner){
        throw new AppError("Бүртгэлтэй username байна.", 409);
    }
    const dugaar= await customerRepository.findCustomerByRegisterNo(regno);
    if(dugaar){
        throw new AppError("Бүртгэлтэй регистерийн дугаар байна. ", 409)
    }
    const passHash= await bcrypt.hash(pass, 10);
    const customerData= {first_name: first_name.trim(), last_name: last_name.trim(), register_no: register_no.trim().toLowerCase(), birth_date, phone: phone, email:imeel1,}
    const userData= {full_name: `${last_name.trim()} ${first_name.trim()}`, username: ner1, email:imeel1 , phone:utas1, password_hash: passHash, role: "customer", is_active: true,}
    const res= await sequelize.transaction(async (transaction)=>{
        const customer= await customerRepository.createCustomer(customerData, transaction);
        const user= await authRepository.createUser({...userData, customer_id: customer.id}, transaction);
        return {customer, user, }
    });
    return {customer: {id: res.customer_id, first_name: res.customer.first_name, last_name: res.customer.last_name, register_no: res.customer.register_no, birth_date: res.customer.birth_date, phone: res.customer.phone, email: res.customer.email,}, user:{id: res.user.id, customer_id: res.user.customer_id, username: res.user.username, full_name: res.user.full_name, email:res.user.email, phone:res.user.phone, role:res.user.role, is_active: res.user.is_active, }};
}

