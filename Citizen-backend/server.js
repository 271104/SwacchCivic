// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");

// Load env
dotenv.config();

const app = express();

// ---------------- RATE LIMIT ----------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
  })
);

// ---------------- MIDDLEWARES ----------------
app.use(express.json());

// ✅ FIXED: allow frontend from anywhere (DEV MODE)
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true
  })
);

// ---------------- STATIC FILES ----------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- ENV ----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smc_db";

// ---------------- DB CONNECT ----------------
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
    console.log("📌 DB Name:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ---------------- ROUTES ----------------
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

app.get("/", (req, res) => {
  res.send("SMC API running");
});

// ✅ IMPORTANT: API BASE PATH
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
