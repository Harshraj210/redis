import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const BANNER_KEY = "app:banner";
app.post("/banner", async (req, res) => {
  // set --> match key value pair
  await redis.set(BANNER_KEY, req.body.message || "welcome to redis");
  res.json({ success: true });
});
app.get("/banner", async (req, res) => {
  await redis.set(BANNER_KEY);
  res.json({ message });
});
app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ message });
});

