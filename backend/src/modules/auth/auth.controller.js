import * as authService from "./auth.service.js"
import asyncHandler from "../../utils/asyncHandler.js";
import {Success} from "../../utils/sendResponse.js";
export const getMe= asyncHandler(async (req, res) => {
    const data= await authService.getMe(req.user.id);
    return Success(res, data);
});
export const login= asyncHandler(async (req, res) => {
    const data= await authService.login(req.body);
    return Success(res, data, 200, "Амжилттай нэвтэрлээ");
});
export const register= asyncHandler(async (req, res) => {
    const data= await authService.register(req.body);
    return Success(res, data, 201, "Амжилттай бүртгэгдлээ")
});
// export async function register(req, res){
//     try{
//         const data= req.body;
//         const registered= await authService.register(data);
//         res.status(201).json({
//             success:true,
//             data:registered,
//         });
//     }
//     catch(error){
//         console.error("reg err:", error);
//         console.error("val err:", error.errors);
//         const dup=["Бүртгэлтэй и-мейл байна", "Бүртгэлтэй утасны дугаар байна", "Бүртгэлтэй username байна", "Бүртгэлтэй регистерийн дугаар байна."];
//         const valid =["Талбарыг бүрэн бөглөнө үү", "Нууц үг таарахгүй байна", "Нууц үг 8-аас дээш тэмдэгттэй байх ёстой"];
//         let statusCode = 500;
//         if (dup.includes(error.message)){
//             statusCode = 409;
//         } 
//         else if (valid.includes(error.message)){
//             statusCode = 400;
//         }
//         return res.status(statusCode).json({
//             success: false,
//             message: statusCode === 500 ? "Бүртгэл үүсгэхэд алдаа гарлаа." : error.message, ...(statusCode === 500 && {error: error.message,}),
//     });
//   }
// }