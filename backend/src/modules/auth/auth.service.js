import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
export async function login(loginData) {
    const {login, password} = loginData;
    if (!login?.trim() || !password?.trim()){
        throw new Error("Нэвтрэх нэр болон нууц үг оруулна уу.");
    }
    const user = await authRepository.findUserByLogin(login);
    if (!user){
        throw new Error("Хэрэглэгч олдсонгүй.");
    }
    if (!user.is_active){
        throw new Error("Идэвхгүй хэрэглэгч байна.");
    }
    const correctPass = await bcrypt.compare(password, user.password_hash);
    if (!correctPass){
        throw new Error("Нууц үг буруу байна.");
    }
    const token = jwt.sign({id: user.id, customer_id: user.customer_id, role: user.role,}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1h",});
    return {token, user: {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role,},
    };
}
export async function getMe(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new Error("Хэрэглэгч олдсонгүй.");
    }
    return {id: user.id, customer_id: user.customer_id, username: user.username, full_name: user.full_name, email: user.email,phone: user.phone, role: user.role, is_active: user.is_active,};
}

