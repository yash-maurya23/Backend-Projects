import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import connectDB from "./db/db.js";

const app=express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('',(req,res)=>{
  res.send("kya haal hai?");
});

app.listen(PORT,()=>{
console.log(`app is running ${PORT}`)
});