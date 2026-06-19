import rateLimit from "express-rate-limit";
export const limitRate= rateLimit({
    windowMs: 15*60*1000,
    limit: 5,
    skipSuccessfulRequests:true,
    message:{
        success:false,
        error:"15 минутын дараагаар дахин оролдоно уу.",
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
});
export const apiLimit= rateLimit({
    windowMs:15*60*1000,
    limit: 300,
    message:{
        success:false,
        error:"Too many requests."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
});
export const regsiterLimit= rateLimit({
    windowMs:60*60*1000,
    limit: 5,
    skipSuccessfulRequests:true,
    message:{
        success:false,
        error:"15 минутын дараагаар дахин оролдоно уу."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
});
export const paymentLimit= rateLimit({
    windowMs:1*60*1000,
    limit:5,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    message:{
        success:false,
        error:"Түр хүлээгээд дахин оролдоно уу."
    }
});
export const passwordChangeLimit= rateLimit({
    windowMs:5*60*1000,
    limit: 5,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    message:{
        success: false,
        error:"Хэт олон удаагийн оролдлого. 15 минутын дараагийн оролдоно уу."
    }
})

