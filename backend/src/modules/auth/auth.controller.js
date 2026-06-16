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
        res.status(500).json({
            success:false,
            message:"Нэвтрэхэд алдаа",
            error:error.message
        });
    }
}