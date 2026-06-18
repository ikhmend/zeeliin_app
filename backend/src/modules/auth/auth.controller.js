import * as authService from "./auth.service.js"
export async function getMe(req, res){
    try{
        const userid= req.user.id;
        const user= await authService.getMe(userid);
        res.status(200).json({
            success:true,
            data:user
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Хэрэглэгчийн мэдээлэл авахад алдаа",
            error:error.message
        });
    }
}
export async function login(req, res){
    try{
        const user= await authService.login(req.body);
        res.status(200).json({
            success:true,
            data:user
        });
    }
    catch(error){
        console.log("login body:", req.body);
        res.status(500).json({
            success:false,
            message:"Нэвтрэхэд алдаа",
            error:error.message
        });
    }
}
export async function register(req, res){
    try{
        const data= req.body;
        const registered= await authService.register(data);
        res.status(201).json({
            success:true,
            data:registered,
        });
    }
    catch(error){
        console.error("reg err:", error);
        console.error("val err:", error.errors);
        const dup=["Бүртгэлтэй и-мейл байна", "Бүртгэлтэй утасны дугаар байна", "Бүртгэлтэй username байна", "Бүртгэлтэй регистерийн дугаар байна."];
        const valid =["Талбарыг бүрэн бөглөнө үү", "Нууц үг таарахгүй байна", "Нууц үг 8-аас дээш тэмдэгттэй байх ёстой"];
        let statusCode = 500;
        if (dup.includes(error.message)){
            statusCode = 409;
        } 
        else if (valid.includes(error.message)){
            statusCode = 400;
        }
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? "Бүртгэл үүсгэхэд алдаа гарлаа." : error.message, ...(statusCode === 500 && {error: error.message,}),
    });
  }
}