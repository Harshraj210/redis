import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
function otp(phone) {
  return `otp:${phone}`;
}
app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const generatedOtp = Math.floor(100000 + Math.random() * 900000);
  // Store OTP in Redis with TTL of 60 sec
  await redis.set(otpkey(phone), generatedOtp, "EX", 30);
  res.json({
    success: true,
    otp: generatedOtp,
    expiresIn: "30 seconds",
  });
});
app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const saved_otp = await redis.get(otpkey(phone));
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
  await redis.del(otpKey(phone));

  res.json({
    success: true,
    message: "OTP verified successfully",
  });
});
app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));

  res.json({ ttl });
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
