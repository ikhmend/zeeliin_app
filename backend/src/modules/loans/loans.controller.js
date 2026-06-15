import * as loanBusinessServices from "../loans/loans.business.service.js";
import * as loancrudServices from "../loans/loans.Crud.service.js";
export async function createLoan(req, res){
    try{
        const data=req.body;
        const newLoan= await loanBusinessServices.createLoan(data);
        res.status(201).json({
            success:true,
            data:newLoan
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээл үүсгэхэд алдаа.",
            error:error.message
        });
    }
}
export async function getLoans(req, res){
    try{
        const loans= await loancrudServices.getLoans();
        res.status(200).json({
            success: true,
            data:loans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн мэдээлэл авахад алдаа.",
            error: error.message
        });
    }
}
export async function getLoan(req, res){
    try{
        const {id}=req.params;
        const loan=await loancrudServices.getLoan(id);
        if(!loan){
            return res.status(404).json({
                success:false,
                message:"Зээлийн мэдээлэл олдсонгүй.",
            });
        }
        res.status(200).json({
            success:true,
            data: loan
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн мэдээлэл авахад алдаа",
            error:error.message
        });
    }
}
export async function updateLoan(req, res){
    try{
        const {id}=req.params;
        const {data}=req.body
        const updatedLoan=await loancrudServices.updateLoan(id, data);
        res.status(200).json({
            success:true,
            data:updatedLoan
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн мэдээлэл шинэчлэхэд алдаа.",
            error:error.message
        });
    }
}
export async function updateLoanAfterPayment(req, res){
    try{
        const {id}=req.params;
        const remainingBalance=req.body;
        const data= await loancrudServices.updateLoanAfterPayment(id, remainingBalance);
        res.status(200).json({
            success:true,
            data:data
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн мэдээлэл шинэчлэхэд алдаа",
            error:error.message
        });
    }
}
export async function searchLoans(req, res){
    try{
        const {tulhuur}=req.query;
        if (!tulhuur?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Хайх түлхүүр үг оруулна уу.",
        });}
        const loans=await loancrudServices.searchLoans(tulhuur);
        if(loans===0){
            return res.status(404).json({
                message:"Түлхүүрд тохирох зээл олдсонгүй."
            });
        }
        res.status(200).json({
            success:true,
            data:loans
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн мэдээлэл хайхад алдаа.",
            error:error.message
        });
    }
}
export async function getLoansByCustomerId(req, res){
    try{
        const {customerId}=req.params;
        const loans=await loancrudServices.getLoansByCustomerId(customerId);
        if(!loans){
            return res.status(404).json({
                message:"Харилцагчид зээл байхгүй."
            });
        }
        res.status(200).json({
            success:true,
            data: loans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Харилцагчийн дугаарар зээл хайхад алдаа.",
            error:error.message
        });
    }
}
export async function getActiveLoans(req, res){
    try{
        const activeLoans=await loancrudServices.getActiveLoans();
        if(!activeLoans){
            return res.status(404).json({
                message:"Идэвхтэй зээл олдсонгүй."
            });
        }
        res.status(200).json({
            success:true,
            data:activeLoans
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Идэвхтэй зээлийн мэдээлэл хайхад алдаа",
            error:error.message
        });
    }
}
export async function getInactiveLoans(req, res){
    try{
        const inactiveLoans=await loancrudServices.getInactiveLoans();
        if(!inactiveLoans){
            return res.status(404).json({
                message:"Идэвхгүй зээл олдсонгүй."
            });
        }
        res.status(200).json({
            success:true,
            data:inactiveLoans
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Идэвхгүй зээлийн мэдээлэл хайхад алдаа",
            error:error.message
        });
    }
}
export async function getLoansByProduct(req, res){
    try{
        const {loanProduct}=req.query;
        const loans=await loancrudServices.getLoansByProduct(loanProduct);
        if(loans.length===0){
            return res.status(404).json({
                message:"Зээлийн бүтээгдэхүүнд тохирох зээл олдсонгүй."
            });
        }
        res.status(200).json({
            success:true,
            data:loans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Зээлийн бүтээгдэхүүнээр зээл хайхад алдаа",
            error:error.message
        });
    }
}