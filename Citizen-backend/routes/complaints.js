// routes/complaints.js
// const express = require("express");
// const authMiddleware = require("../middleware/auth");
// const requireRole = require("../middleware/role");
// const upload = require("../middleware/upload");
// const Complaint = require("../models/Complaint");
// const { protect } = require("../middleware/auth");


// const router = express.Router();

// // Citizen: create complaint (with photo)
// router.post(
//   "/",
//   authMiddleware,
//   requireRole("citizen"),
//   upload.single("photo"), // form field name must be "photo"
//   async (req, res) => {
//     try {
//       const { type, description, location } = req.body;

//       if (!type) {
//         return res.status(400).json({ message: "Complaint type is required" });
//       }

//       if (!req.file) {
//         return res.status(400).json({ message: "Complaint photo is required" });
//       }

//       const complaint = new Complaint({
//         citizen: req.userId,
//         type,
//         description,
//         location,
//         photoPath: req.file.path, // e.g. "uploads/complaints/complaint-123.jpg"
//       });

//       await complaint.save();

//       res.status(201).json({
//         message: "Complaint registered successfully",
//         complaint,
//       });
//     } catch (err) {
//       console.error("Create complaint error:", err.message);
//       res
//         .status(500)
//         .json({ message: "Server error while creating complaint" });
//     }
//   }
// );

// // Citizen: list own complaints
// router.get(
//   "/mine",
//   authMiddleware,
//   requireRole("citizen"),
//   async (req, res) => {
//     try {
//       const complaints = await Complaint.find({ citizen: req.userId })
//         .sort({ createdAt: -1 });

//       res.json(complaints);
//     } catch (err) {
//       console.error("Get my complaints error:", err.message);
//       res
//         .status(500)
//         .json({ message: "Server error while fetching complaints" });
//     }
//   }
// );

// router.get(
//   "/",
//   authMiddleware,
//   requireRole("officer"),
//   async (req, res) => {
//     try {
//       const complaints = await Complaint.find()
//         .populate("citizen", "name phone")
//         .sort({ createdAt: -1 });

//       const formatted = complaints.map((c) => ({
//         id: c._id,
//         type: c.type,
//         description: c.description,
//         location: c.location,
//         status: c.status,
//         createdAt: c.createdAt,
//         citizen: c.citizen
//           ? {
//               id: c.citizen._id,
//               name: c.citizen.name,
//               phone: c.citizen.phone,
//             }
//           : null,
//         photoUrl: c.photoPath
//           ? `http://localhost:5000/${c.photoPath.replace(/\\/g, "/")}`
//           : null,
//       }));

//       res.json(formatted);
//     } catch (err) {
//       console.error("Get all complaints error:", err.message);
//       res
//         .status(500)
//         .json({ message: "Server error while fetching complaints" });
//     }
//   }
// );



// module.exports = router;

const express = require("express");
const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/role");
const upload = require("../middleware/upload");
const Complaint = require("../models/Complaint");

const router = express.Router();

/* ===============================
   Citizen: Create Complaint
================================ */
router.post(
  "/",
  authMiddleware,
  requireRole("citizen"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { type, description, location } = req.body;

      if (!type) {
        return res.status(400).json({ message: "Complaint type is required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Complaint photo is required" });
      }

      const complaint = new Complaint({
        citizen: req.userId,   // ✅ FIXED
        type,
        description,
        location,
        photoPath: req.file.path,
      });

      await complaint.save();

      res.status(201).json({
        message: "Complaint registered successfully",
        complaint,
      });
    } catch (err) {
      console.error("Create complaint error:", err.message);
      res.status(500).json({ message: "Server error while creating complaint" });
    }
  }
);

/* ===============================
   Citizen: My Complaints
================================ */
router.get(
  "/mine",
  authMiddleware,
  requireRole("citizen"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        citizen: req.userId,   // ✅ FIXED
      }).sort({ createdAt: -1 });

      res.json(complaints);
    } catch (err) {
      console.error("Get my complaints error:", err.message);
      res.status(500).json({ message: "Server error while fetching complaints" });
    }
  }
);

/* ===============================
   Officer: All Complaints
================================ */
router.get(
  "/",
  authMiddleware,
  requireRole("officer"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("citizen", "name phone")
        .sort({ createdAt: -1 });

      const formatted = complaints.map((c) => ({
        id: c._id,
        type: c.type,
        description: c.description,
        location: c.location,
        status: c.status,
        createdAt: c.createdAt,
        citizen: c.citizen
          ? {
              id: c.citizen._id,
              name: c.citizen.name,
              phone: c.citizen.phone,
            }
          : null,

        // ✅ Windows path → browser-safe URL
        photoUrl: c.photoPath
          ? `http://localhost:5000/${c.photoPath.replace(/\\/g, "/")}`
          : null,
      }));

      res.json(formatted);
    } catch (err) {
      console.error("Get all complaints error:", err.message);
      res.status(500).json({ message: "Server error while fetching complaints" });
    }
  }
);

// Officer: update complaint status
router.put(
  "/:id/status",
  authMiddleware,
  requireRole("officer"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["pending", "in_progress", "resolved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      complaint.status = status;
      await complaint.save();

      res.json({
        message: "Complaint status updated successfully",
        complaint,
      });
    } catch (err) {
      console.error("Update status error:", err.message);
      res.status(500).json({ message: "Server error while updating status" });
    }
  }
);


module.exports = router;
