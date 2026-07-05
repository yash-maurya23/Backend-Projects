import dotenv from "dotenv";

dotenv.config({ path: './.env' });

import express from 'express';
import connectDB from "./db/db.js";
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('', (req, res) => {
  res.send("kya haal hai?");
});

app.listen(PORT, () => {
  console.log(`app is running ${PORT}`);
});