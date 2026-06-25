import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import * as customerRepository from "../customers/customer.repository.js"
import sequelize from "../../config/sequelize.js";
import AppError from "../../utility/AppError.js";
import cookieParser from "cookie-parser";
import crypto, { randomBytes } from "crypto";
import * as passRepository from "./password.reset.repesitory.js";
import { sendPasswordResetEmail } from "../../utility/email.service.js";
export async function login(loginData) {
    const {login, password} = loginData;
    // if (!login?.trim() || !password?.trim()){
    //     throw new AppError("Нэвтрэх нэр болон нууц үг оруулна уу.", 400);
    // }
    const user = await authRepository.findUserByLogin(login);
    if (!user){
        throw new AppError("Нэвтрэх мэдээлэл буруу.", 404);
    }
    if (!user.is_active){
        throw new AppError("Нэвтрэх мэдээлэл буруу", 400);
    }
    const correctPass = await bcrypt.compare(password, user.password_hash);
    if (!correctPass){
        throw new AppError("Нэвтрэх мэдээлэл буруу", 400);
    }
    const token = jwt.sign({id: user.id, customer_id: user.customer_id, role: user.role,}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN || "1h",});
    const rtoken= jwt.sign({id: user.id,}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"});
    const rtokenHash= crypto.createHash("sha256").update(rtoken).digest("hex"); //husnegtend hadgalna, password solihod revoked bolno
    const decoded= jwt.decode(rtoken);
    if(!decoded?.exp){
        throw new AppError("Токены хугацаа тодорхойлж чадсангүй.", 500);
    }
    const expiresAt = new Date(decoded.exp*1000);
    await authRepository.createRefreshSession({user_id: user.id, token_hash: rtokenHash, expires_at: expiresAt});
    return {token, rtoken, user: {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role,},
    };
}
export async function getMe(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new AppError("Нэвтрэх мэдээлэл буруу байна", 404);
    }
    return {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email,phone: user.phone, role: user.role, is_active: user.is_active,};
}
export async function register(data){
    const {first_name, last_name, register_no, birth_date, phone, email, username, pass, repass}= data;
    if(!first_name?.trim() || !last_name?.trim() || !phone?.trim() || !email?.trim() || !username?.trim() || !pass?.trim() || !repass?.trim() || !register_no?.trim() || !birth_date){
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
    const imeel= await authRepository.findUserByUnique({email: imeel1});
    if(utas1.length<8){
        throw new AppError("Утасны дугаарыг зөв бүртгүүлнэ үү.", 400);
    }
    if (imeel){
        throw new AppError("Бүртгэлтэй и-мейл байна.", 409);
    }
    const utas= await authRepository.findUserByUnique({phone: utas1});
    if (utas){
        throw new AppError("Бүртгэлтэй утасны дугаар байна.", 409);
    }
    const ner= await authRepository.findUserByUnique({username: ner1});
    if (ner){
        throw new AppError("Бүртгэлтэй username байна.", 409);
    }
    const dugaar= await customerRepository.findCustomerByRegisterNo(regno);
    if(dugaar){
        throw new AppError("Бүртгэлтэй регистерийн дугаар байна.", 409)
    }
    const passHash= await bcrypt.hash(pass, 10);
    const customerData= {first_name: first_name.trim(), last_name: last_name.trim(), register_no: register_no.trim().toLowerCase(), birth_date, phone: phone, email:imeel1,}
    const userData= {full_name: `${last_name.trim()} ${first_name.trim()}`, username: ner1, email:imeel1 , phone:utas1, password_hash: passHash, role: "customer", is_active: true,}
    const res= await sequelize.transaction(async (transaction)=>{
        const customer= await customerRepository.createCustomer(customerData, transaction);
        const user= await authRepository.createUser({...userData, customer_id: customer.id}, transaction);
        return {customer, user, }
    });
    return {customer: {id: res.customer.id, first_name: res.customer.first_name, last_name: res.customer.last_name, register_no: res.customer.register_no, birth_date: res.customer.birth_date, phone: res.customer.phone, email: res.customer.email,}, user:{id: res.user.id, customer_id: res.user.customer_id, username: res.user.username, full_name: res.user.full_name, email:res.user.email, phone:res.user.phone, role:res.user.role, is_active: res.user.is_active, }};
}
export async function changeMyPassword(userId, passData) {
  const { currentPass, newPass, confirmPass } = passData;
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new AppError("Хэрэглэгч олдсонгүй.", 404);
  }
  const isCurrentPasswordCorrect =await bcrypt.compare(currentPass, user.password_hash);
  if (!isCurrentPasswordCorrect) {
    throw new AppError("Одоогийн нууц үг буруу байна.", 400);
  }
  const isSameAsOldPassword = await bcrypt.compare(newPass, user.password_hash);
  if (isSameAsOldPassword) {
    throw new AppError("Шинэ нууц үг хуучин нууц үгээс өөр байх ёстой.", 400);
  }
  const newHash = await bcrypt.hash(newPass, 10);
  const updated = await authRepository.changePassword(user.id, newHash);
  const revoked= await authRepository.revokeAllSessions(user.id);
  if (!updated) {
    throw new AppError("Нууц үг солих амжилтгүй боллоо.", 500);
  }
  return {message: "Нууц үг амжилттай солигдлоо.",};
}
export async function refresh(refreshToken){
    if(!refreshToken){
        throw new AppError("Refresh Token байхгүй.", 404);
    }
    let decoded;
    try{
        decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch(error){
        throw new AppError("Refresh Token хүчингүй эсвэл хугацаа дууссан.", 401);
    }
    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session= await authRepository.findSessionByHash(refreshTokenHash); //eniig hiigeegui baigaa
    if(!session){
        throw new AppError("No session found", 404);
    }
    if(session.revoked_at){
        throw new AppError("Session хүчингүй.", 401);
    }
    if (new Date(session.expires_at) <= new Date()) {
        throw new AppError("Session-ийн хугацаа дууссан байна.", 401);
    }
    const user= await authRepository.findUserById(decoded.id);
    if (!user) {
        throw new AppError("Хэрэглэгч олдсонгүй.", 401);
    }
    if(!user.is_active){
        throw new AppError("Идэвхгүй хэрэглэгч", 404);
    }
    if (Number(session.user_id) !== Number(decoded.id)) {
        throw new AppError("Refresh token болон session тохирохгүй байна.",401);
    }
    const newToken= jwt.sign({id: user.id, customer_id: user.customer_id,}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1h",});
    return {token: newToken};
}
export async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await authRepository.revokeSessionByHash(refreshTokenHash);
}

export async function createPasswordResetToken(email) {
  const user = await authRepository.findUserByUnique({ email });
  if (!user) {
    throw new AppError("Алдаа гарлаа, дахин оролдоно уу", 400);
  }
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await passRepository.createPassReset(user.id, tokenHash, expiresAt);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetLink);
  return true;
}
export async function verifyPasswordResetToken(token) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetRecord =await passRepository.findValidPasswordReset(tokenHash);
  if (!resetRecord) {
    throw new AppError("Reset token хүчингүй эсвэл хугацаа дууссан байна", 400);
  }
  return resetRecord;
}
export async function resetPassword(token, newPassword) {
  const resetRecord = await verifyPasswordResetToken(token);
  const passwordHash = await bcrypt.hash(newPassword, 12);
  return await sequelize.transaction(async (transaction)=> {
    await authRepository.updateUserPassword(resetRecord.user_id, passwordHash, transaction);
    await passRepository.markPasswordResetAsUsed(resetRecord.id, transaction);
    await authRepository.revokeAllSessions(resetRecord.user_id, transaction)
    return {message: "Нууц үг амжилттай шинэчлэгдлээ",};
  });
}