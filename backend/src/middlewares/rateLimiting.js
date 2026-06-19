import express from "express";
import rateLimit from "express-rate-limit";
const limitRate= rateLimit({
    windowMs: 15*60*1000,
    max: 5,
    message:{
        status:429,
        error:"15 минутын дараагаар дахин оролдоно уу.",
    },
    standardHeaders:true,
    legacyHeaders:true,
})