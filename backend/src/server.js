import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import "./models/index.js"
import loanRoutes from "./modules/loans/loans.route.js";
import sequelize from "./config/sequelize.js";
import authRoutes from "./modules/auth/auth.route.js"
import personalRoutes from "./modules/personal/personal.route.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/loans", loanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", personalRoutes);
app.get("/", (req, res)=>{
    res.send("ajillaj baina");
});
app.get("/api/test", async (req, res)=>{
    try{
        const a=await pool.query("select * from users where id=15");
        res.json({message: "db holbogdson", data: a.rows,});
    }
    catch(error){
        res.status(500).json({message: "db holbolt amjiltgui", error: error.message});
    }
});
app.use(notFoundHandler);
app.use(errorHandler);
const port=process.env.PORT || 5000;
async function start(){
    await sequelize.authenticate();
    app.listen(port, ()=>{
        console.log(`server on: ${port}`);
    });
}