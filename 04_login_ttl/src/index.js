import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
 function otp(phone){
  return `otp:${phone}`;
 }
app.post("/otp", async (req, res) => {
  const phone = req.body;
  
});