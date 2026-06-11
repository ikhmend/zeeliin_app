import { findCustomer, findCustomersWithKeyword } from "../repository/customer.repository.js";
import * as customerService from "../service/customer.service.js";
export async function getCustomers(req, res){
    try {
        const customers= await customerService.getAllCustomers();
        res.status(200).json({
            success: true,
            data: customers
        });   
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: "Customers авахад алдаа.",
            error: error.message
        });
    }
}
export async function getCustomer (req, res){
    try{
        const {id}=req.params;
        const customer=await customerService.getCustomer(id);
        if(!customer){
            res.status(404).json({
                success: false,
                message: "Харилцагч олдсонгүй.",
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: customer
            });
        }        
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Нэг харицлагчийн мэдээлэл авахад алдаа.",
            error: error.message
        });
    }
}
export async function getCustomerWithKeyword(req, res){
    try{
        const {keyword}=req.query;
        if (!keyword?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Хайх түлхүүр үг оруулна уу.",
        });
        }
        const customers= await customerService.getCustomerWithKeyword(keyword);
        if(!customers){
            res.status(404).json({
                success: false,
                message:"Түлхүүрд тохирох харилцагч олдсонгүй."
            });
        }
        res.status(200).json({
            success: true,
            data: customers
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Түлхүүрээр харилцагч хайхад алдаа.",
            error:error.message
        });
    }
}
export async function createCustomer(req, res){
    try{
        const data=req.body;
        const newCustomer= await customerService.createCustomer(data);
        res.status(201).json({
            success: true,
            data: newCustomer
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"Шинэ харилцагч үүсгэхэд алдаа.",
            error: error.message
        });
    }
}
export async function updateCustomer(req, res){
    try{
        const {id}=req.params;
        const data=req.body;
        const updatedCustomer=await customerService.updateCustomer(id, data);
        if(!updatedCustomer){
            return res.status(404).json({
                success:false,
                message:"Мэдээлэл шинэчлэхэд алдаа.",
            });
        }
        res.status(200).json({
            success:true,
            data:updatedCustomer
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Мэдээлэл шинэчлэхэд алдаа.",
            error: error.message
        });
    }
}
export async function getCustomerProfile(req, res){
    try{
        const{id}=req.params;
        const customer= await customerService.getCustomerProfile(id);
        if(!customer){
            return res.status(400).json({
                success:false,
                message:"Харилцагч олдсонгүй.",
            });
        }
        res.status(200).json({
            success:true,
            data: customer
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Харилцагчийн дэлгэрэнгүй мэдээллийг авахад алдаа",
            error:error.message
        });
    }
}
export async function getCustomersActiveLoans(req, res){
    try{
        const {id}=req.params;
        const activeLoans= await customerService.getCustomersActiveLoans(id);
        res.status(200).json({
            success:true,
            data:activeLoans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"харилцагчийн идэвхтэй зээлийн мэдээлэл авахад алдаа.",
            error:error.message
        });
    }
}
export async function getCustomersInactiveLoans(req, res){
    try{
        const {id}=req.params;
        const inactiveLoans= await customerService.getCustomersInactiveLoans(id);
        res.status(200).json({
            success:true,
            data:inactiveLoans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Харилцагчийн идэвхгүй зээлийн мэдээлэл авахад алдаа.",
            error:error.message
        });
    }
}
export async function getAllActiveLoans(req, res){
    try{
        const activeLoans=await customerService.getAllActiveLoans();
        res.status(200).json({
            success:true,
            data:activeLoans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Идэвхтэй зээлийн мэдээлэл авахад алдаа.",
            error:error.message
        });
    }
}
export async function getAllInactiveLoans(req, res){
    try{
        const inactiveLoans=await customerService.getAllInactiveLoans();
        res.status(200).json({
            success:true,
            data:inactiveLoans
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Идэвхгүй зээлийн мэдээлэл авахад алдаа.",
            error:error.message
        });
    }
}