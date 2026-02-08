// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Citizen = require("../models/Citizen");
const Officer = require("../models/Officer");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// ================= CITIZEN REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, phone, and password" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if phone already exists in citizens
    const existingCitizen = await Citizen.findOne({ phone });
    if (existingCitizen) {
      return res
        .status(400)
        .json({ message: "An account with this phone already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const citizen = new Citizen({
      name,
      phone,
      password: hashedPassword,
    });

    await citizen.save();

    const token = jwt.sign(
      { userId: citizen._id, role: "citizen" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Citizen registered successfully",
      user: {
        id: citizen._id,
        name: citizen.name,
        phone: citizen.phone,
        role: "citizen",
      },
      token,
    });
  } catch (err) {
    console.error("Citizen register error:", err.message);

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Phone number is already registered" });
    }

    res.status(500).json({ message: "Server error while registering citizen" });
  }
});

// ================= CITIZEN LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide phone and password" });
    }

    const citizen = await Citizen.findOne({ phone });
    if (!citizen) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!citizen.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: citizen._id, role: "citizen" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Logged in successfully",
      user: {
        id: citizen._id,
        name: citizen.name,
        phone: citizen.phone,
        role: "citizen",
      },
      token,
    });
  } catch (err) {
    console.error("Citizen login error:", err.message);
    res.status(500).json({ message: "Server error while logging in" });
  }
});

// ================= OFFICER REGISTER =================
router.post("/officer/register", async (req, res) => {
  try {
    const { name, email, phone, password, department } = req.body;

    if (!name || !email || !phone || !password || !department) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email or phone already exists
    const existingOfficer = await Officer.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingOfficer) {
      return res
        .status(400)
        .json({ message: "An account with this email or phone already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const officer = new Officer({
      name,
      email,
      phone,
      password: hashedPassword,
      department,
      status: "pending", // Requires admin approval
    });

    await officer.save();

    res.status(201).json({
      message: "Officer registration submitted. Awaiting admin approval.",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        department: officer.department,
        status: officer.status,
      },
    });
  } catch (err) {
    console.error("Officer register error:", err.message);

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or phone number is already registered" });
    }

    res.status(500).json({ message: "Server error while registering officer" });
  }
});

// ================= OFFICER LOGIN =================
router.post("/officer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const officer = await Officer.findOne({ email: email.toLowerCase() })
      .populate('department', 'name complaintTypes');
    
    if (!officer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check officer status
    if (officer.status === "pending") {
      return res.status(403).json({ 
        message: "Your account is pending approval. Please wait for admin approval." 
      });
    }

    if (officer.status === "rejected") {
      return res.status(403).json({ 
        message: "Your account has been rejected. Please contact admin." 
      });
    }

    if (officer.status === "inactive") {
      return res.status(403).json({ 
        message: "Your account has been deactivated. Please contact admin." 
      });
    }

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: officer._id, role: "officer" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Logged in successfully",
      user: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        role: "officer",
        department: officer.department,
        status: officer.status,
      },
      token,
    });
  } catch (err) {
    console.error("Officer login error:", err.message);
    res.status(500).json({ message: "Server error while logging in" });
  }
});

module.exports = router;
