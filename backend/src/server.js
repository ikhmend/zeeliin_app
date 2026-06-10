import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json);
app.get("/", (req, res)=>{
    res.send("ajillaj baina");
});
const port=process.env.port || 5000;
app.listen(port, ()=>{
    console.log(`server: ${port}`);
})