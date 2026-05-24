import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Create Redis Key
function otpKey(phone) {
  return `otp:${phone}`;
}

//  SEND OTP

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  const generatedOtp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP in Redis with TTL
  await redis.set(otpKey(phone), generatedOtp, "EX", 30);

  res.json({
    success: true,
    otp: generatedOtp,
    expiresIn: "30 seconds",
  });
});

//VERIFY OTP

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = await redis.get(otpKey(phone));

  // OTP expired
  if (!savedOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  // Compare OTP
  if (savedOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // Delete OTP after success
  await redis.del(otpKey(phone));

  res.json({
    success: true,
    message: "OTP verified successfully",
  });
});

// CHECK TTL
// we can use attempts max attempts 
app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));

  res.json({ ttl });
});
app.get("/", (req, res) => {
  res.send("OTP SERVER RUNNING");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
