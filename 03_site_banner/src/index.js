import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const BANNER_KEY = "app:banner";
app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "welcome to redis");
  res.json({ success: true });
});
