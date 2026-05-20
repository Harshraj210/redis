import express from "express";
import Redis from "ioredis";
import mongoose from 'mongoose'
const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
app.get("/redis", async (req, res) => {
  try {
    // Check Redis connection
    const reply = await redis.ping();

    res.json({
      redis: reply,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
app.get("/mongo", async (req, res) => {
  try {
    const url =
      process.env.MONGO_URL || "mongodb://localhost:27017/chai_aur_redis";

    // Connect only if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }

    res.json({
      mongo: "connected",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
app.get("/", (req, res) => {
  res.send("Redis + Mongo Backend Running");
});



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
