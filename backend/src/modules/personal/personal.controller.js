import * as personalService from "./personal.service.js";
export async function getDashboard(req, res){
    try{
        const id= req.user.customer_id;
        const data= await personalService.getDashboardData(id);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Dashboard мэдээлэл авахад алдаа.",
            error:error.message,
        });
    }
}
export async function getProfile(req, res){
    try{
        const userId=req.user.id;
        const customerId=req.user.customer_id;
        const data= await personalService.getProfileData(userId, customerId);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Хэрэглэгчийн мэдээлэл авахад алдаа.",
            error:error.message,
        });
    }
}
export async function updateProfile(req, res){
    try{
        const customerId=req.user.customer_id;
        const customerData= req.body;
        const data= await personalService.updateProfile(customerId, customerData);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Хэрэглэгчийн мэдээлэл шинэчлэхэд алдаа.",
            error:error.message,
        });
    }
}
export async function getMyLoans(req, res){
    try{
        const id=req.user.customer_id;
        const data= await personalService.getMyLoans(id);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Харилцагчийн зээлийн мэдээлэл авахад алдаа.",
            error:error.message,
        });
    }
}
export async function getMyLoanById(req, res){
    try{
        const loanId=req.params.loanId;
        const customerId=req.user.customer_id;
        const data= await personalService.getMyLoanById(customerId, loanId);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Хэрэглэгчийн зээлийн мэдээлэл авахад алдаа",
            error:error.message,
        });
    }
}
export async function getMyLoanInstallments(req, res){
    try{
        const customerId=req.user.customer_id;
        const loanId=req.params.loanId;
        const data= await personalService.getMyLoanInstallments(customerId, loanId);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"Зээлийн төлбөрийн хуваарь авахад алдаа.",
            error:error.message,
        });
    }
}
export async function getMyLoanPayments(req, res){
    try{
        const customerId=req.user.customer_id;
        const loanId=req.params.loanId;
        const data= await personalService.getMyLoanPayments(customerId, loanId);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн төлөлтийн түүх авахад алдаа",
            error:error.message,
        });
    }
}
export async function getMyPayments(req, res){
    try{
        const customerId=req.user.customer_id;
        const data= await personalService.getMyPayments(customerId);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Хэрэгэлэгчийн төлөлтийн түүх авахад алдаа.",
            error:error.message,
        });
    }
}
export async function makeMyPayment(req, res){
    try{
        const customerId=req.user.customer_id;
        const loanId=req.params.loanId;
        const paymentData=req.body;
        const data= await personalService.makeMyPayment(customerId, loanId, paymentData);
        res.status(200).json({
            success:true,
            data:data,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн төлбөр хийхэд алдаа",
            error:error.message,
        });
    }
}