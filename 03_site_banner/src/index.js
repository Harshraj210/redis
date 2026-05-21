import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const BANNER_KEY = "app:banner";
app.post("/banner", async (req, res) => {
  // set --> match key value pair
  await redis.set(BANNER_KEY, req.body.message || "welcome to redis");
  res.json({ success: true });
});
app.get("/banner", async (req, res) => {
  const message= await redis.get(BANNER_KEY);
  res.json({ message });
});
app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
   res.json({
    success: true,
    message: "Banner deleted"
  });
});
app.get("/banner/exists", async (req, res) => {
  const exists= await redis.exists(BANNER_KEY);
  // sometimes !! is used for boolean not company standards
  res.json({ exists:Boolean(exists)});
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
