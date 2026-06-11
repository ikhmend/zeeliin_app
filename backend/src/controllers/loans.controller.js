import * as loanServices from "../service/loans.service";
export async function getLoans(req, res){
    try{
        const loans= await loanServices.getLoans();
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