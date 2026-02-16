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

// CORS configuration - allows both local development and production
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5500", 
        "http://127.0.0.1:5500",
        "https://swacchcivic.vercel.app"
    ],
    credentials: true
  })
);

// ---------------- STATIC FILES ----------------
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "complaints");
const fs = require("fs");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- ENV ----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smc_db";

// Log environment status (without exposing sensitive data)
console.log("🔧 Environment Configuration:");
console.log("   PORT:", PORT);
console.log("   MONGO_URI:", MONGO_URI ? "✅ Set" : "❌ Missing");
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log("   GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing");
console.log("   NODE_ENV:", process.env.NODE_ENV || "development");

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
const Department = require("./models/Department");

// Admin routes
const adminAuthRoutes = require("./routes/admin/auth");
const adminDepartmentRoutes = require("./routes/admin/departments");
const adminOfficerRoutes = require("./routes/admin/officers");
const adminStatsRoutes = require("./routes/admin/statistics");

app.get("/", (req, res) => {
  res.send("SMC API running");
});

// Public endpoint for departments (for officer registration)
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select('_id name description complaintTypes')
      .sort({ name: 1 });
    
    const formatted = departments.map(dept => ({
      id: dept._id,
      name: dept.name,
      description: dept.description,
      complaintTypes: dept.complaintTypes
    }));
    
    res.json({ departments: formatted });
  } catch (error) {
    console.error('Get public departments error:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

// ✅ IMPORTANT: API BASE PATH
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// Admin API routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/departments", adminDepartmentRoutes);
app.use("/api/admin/officers", adminOfficerRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
