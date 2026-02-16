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
const { analyzeComplaintImage } = require("../services/aiAnalysisService");
const { calculatePriorityScore, getEstimatedResolution } = require("../utils/priorityCalculator");
const { assignComplaintToDepartment } = require("../services/departmentAssignment");

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
      console.log('📝 Complaint creation started');
      console.log('   User ID:', req.userId);
      console.log('   File received:', !!req.file);
      console.log('   Body:', JSON.stringify(req.body, null, 2));

      const { description, location, latitude, longitude, autoDetectedLocation } = req.body;

      if (!req.file) {
        console.error('❌ No file uploaded');
        return res.status(400).json({ message: "Complaint photo is required" });
      }

      console.log('   File path:', req.file.path);
      console.log('   File size:', req.file.size);

      // 🤖 AI ANALYSIS - Detect complaint type and analyze
      let aiAnalysis = null;
      let aiInsights = null;
      let detectedType = 'Garbage Collection'; // Default fallback

      try {
        console.log(`🤖 Starting AI analysis...`);
        console.log(`   Description: "${description || 'none'}"`);
        console.log(`   Location: "${location}"`);
        
        // AI will detect the complaint type from the image
        aiAnalysis = await analyzeComplaintImage(req.file.path, null, description, location);
        
        // Ensure we have a valid detected type
        if (aiAnalysis && aiAnalysis.detectedComplaintType) {
          detectedType = aiAnalysis.detectedComplaintType;
          console.log(`✅ AI detected type: ${detectedType}`);
        } else {
          console.log(`⚠️ AI did not return a type, using default: ${detectedType}`);
        }

        console.log(`✅ AI Analysis complete:`);
        console.log(`   Detected Type: ${detectedType}`);
        console.log(`   Severity: ${aiAnalysis?.severity || 50}%`);
        console.log(`   Priority: ${aiAnalysis?.priorityLevel || 'medium'}`);

        // Calculate priority score
        const priorityScore = calculatePriorityScore(aiAnalysis, detectedType, location);
        if (aiAnalysis) {
          aiAnalysis.priorityScore = priorityScore;
        }

        // Prepare insights for response
        aiInsights = {
          detectedType: detectedType,
          severity: `${aiAnalysis?.severity || 50}%`,
          priority: aiAnalysis?.priorityLevel || 'medium',
          priorityScore: priorityScore,
          estimatedResolution: getEstimatedResolution(priorityScore),
          description: aiAnalysis?.description || aiAnalysis?.aiDescription || 'AI analysis completed',
          detectedIssues: aiAnalysis?.detectedIssues || [],
          confidence: aiAnalysis?.confidence || 0
        };

      } catch (aiError) {
        console.error('⚠️ AI analysis failed:', aiError);
        console.error('   Error message:', aiError.message);
        console.error('   Error stack:', aiError.stack);
        
        // Ensure we have a valid type even on error
        detectedType = 'Garbage Collection'; // Default fallback
        
        aiAnalysis = {
          severity: 50,
          priorityLevel: 'medium',
          priorityScore: 50,
          detectedComplaintType: detectedType,
          aiError: true,
          errorMessage: aiError.message
        };
        
        aiInsights = {
          detectedType: detectedType,
          severity: '50%',
          priority: 'medium',
          priorityScore: 50,
          estimatedResolution: 'Manual review required',
          description: 'AI analysis unavailable - complaint will be reviewed manually',
          detectedIssues: ['requires_manual_review'],
          confidence: 0
        };
      }

      // Final validation - ensure type is never undefined
      if (!detectedType || detectedType === 'undefined') {
        console.error('⚠️ detectedType is invalid, forcing default');
        detectedType = 'Garbage Collection';
      }

      console.log(`📋 Final complaint type: ${detectedType}`);

      // Prepare geo-location data
      const coordinates = (latitude && longitude) ? {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      } : undefined;

      console.log('🏢 Assigning to department...');
      // 🏢 AUTO-ASSIGN TO DEPARTMENT based on detected type
      let assignedDepartment = null;
      try {
        assignedDepartment = await assignComplaintToDepartment(detectedType);
        if (assignedDepartment) {
          console.log(`✅ Complaint auto-assigned to department: ${assignedDepartment.name}`);
        } else {
          console.log('⚠️ No department found for type:', detectedType);
        }
      } catch (deptError) {
        console.error('⚠️ Department assignment failed:', deptError.message);
        // Continue without department assignment
      }

      console.log('💾 Saving complaint to database...');
      // Create complaint with AI-detected type
      const complaint = new Complaint({
        citizen: req.userId,
        type: detectedType, // AI-detected type
        description: description || aiAnalysis?.description || aiAnalysis?.aiDescription || '',
        location,
        coordinates,
        autoDetectedLocation,
        manualLocation: location,
        photoPath: req.file.path,
        status: 'pending',
        aiAnalysis: aiAnalysis || undefined,
        assignedDepartment: assignedDepartment || undefined,
        assignedAt: assignedDepartment ? new Date() : undefined
      });

      await complaint.save();
      console.log('✅ Complaint saved successfully:', complaint._id);

      res.status(201).json({
        message: "Complaint registered successfully",
        complaint,
        aiInsights: aiInsights
      });

    } catch (err) {
      console.error("❌ Create complaint error:", err);
      console.error("   Error message:", err.message);
      console.error("   Error stack:", err.stack);
      res.status(500).json({ 
        message: "Server error while creating complaint",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
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
   Officer: All Complaints (filtered by department)
================================ */
router.get(
  "/",
  authMiddleware,
  requireRole("officer"),
  async (req, res) => {
    try {
      // Get officer's department
      const Officer = require("../models/Officer");
      const officer = await Officer.findById(req.userId).populate('department');
      
      // Build query - filter by department if officer has one
      const query = {};
      if (officer && officer.department) {
        query.assignedDepartment = officer.department._id;
        console.log(`🔍 Filtering complaints for department: ${officer.department.name}`);
      }

      const complaints = await Complaint.find(query)
        .populate("citizen", "name phone")
        .populate("assignedDepartment", "name")
        .sort({ createdAt: -1 });

      const formatted = complaints.map((c) => ({
        _id: c._id,  // ✅ Changed from 'id' to '_id'
        id: c._id,   // Keep both for compatibility
        type: c.type,
        description: c.description,
        location: c.location,
        status: c.status,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        aiAnalysis: c.aiAnalysis,  // ✅ Include AI analysis
        assignedDepartment: c.assignedDepartment ? {
          id: c.assignedDepartment._id,
          name: c.assignedDepartment.name
        } : null,
        citizen: c.citizen
          ? {
            id: c.citizen._id,
            name: c.citizen.name,
            phone: c.citizen.phone,
          }
          : null,

        // ✅ Windows path → browser-safe URL
        photoPath: c.photoPath,  // ✅ Include original path
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
