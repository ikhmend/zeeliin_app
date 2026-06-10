import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res)=>{
    res.send("ajillaj baina");
});
app.get("/api/test", async (req, res)=>{
    try{
        const a=await pool.query("select * from users");
        res.json({message: "db holbogdson", data: a.rows,});
    }
    catch(error){
        res.status(500).json({message: "db holbolt amjiltgui", error: error.message});
    }
});
const port=process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`server: ${port}`);
})