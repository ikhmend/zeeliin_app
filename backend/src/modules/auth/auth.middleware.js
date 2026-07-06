import jwt from "jsonwebtoken";
export function authMiddleware(req, res, next){
    try{
        const header=req.headers.authorization;
        if(!header){
            return res.status(401).json({
                success:false,
                message:"Токен байхгүй."
            });
        }
        if(!header.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Токен буруу",
            });
        }
        const token= header.split(" ")[1];
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user={id: decoded.id, customer_id:decoded.customer_id, role:decoded.role};
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:"Хугацаа дууссан? хүчингүй?"
        })
    }
}
