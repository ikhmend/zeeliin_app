import * as paymentsService from "./payments.service.js";
export async function makePayment(req, res){
    try{
        const {id}=req.params;
        const data= req.body;
        const madePayment= await paymentsService.makePayment(id, data);
        if (!data){
            return res.status(404).json({
                message: "Төлбөр олдсонгүй."
            });
        }
        res.status(201).json({
            success:true,
            data: madePayment
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Төлөлт хийгдэхэд алдаа",
            error:error.message
        });
    }
}
export async function getPaymentsByLoanId(req, res){
    try{
        const {id}=req.params;
        const payments= await paymentsService.getPaymentsByLoanId(id);
        res.status(200).json({
            success:true,
            data: payments
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Төлөлтийн түүх авахад алдаа",
            error:error.message
        });
    }
}
export async function getPaymentsByInstallmentId(req, res){
    try{
        const {id}=req.params;
        const payments= await paymentsService.getPaymentsByInstallmentId(id);
        res.status(200).json({
            success:true,
            data: payments
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Төлөлтийн түүх авахад алдаа",
            error:error.message
        });
    }
}