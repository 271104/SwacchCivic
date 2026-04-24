// routes/admin/complaints.js
const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const adminAuth = require('../../middleware/adminAuth');

/**
 * @route   GET /api/admin/complaints
 * @desc    Get all complaints with filters
 * @access  Private (Admin)
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, department, type, search } = req.query;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (department) {
      query.assignedDepartment = department;
    }

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('citizen', 'name phone email')
      .populate('assignedDepartment', 'name')
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 });

    // Format response with photo URLs
    const formatted = complaints.map((c) => ({
      _id: c._id,
      id: c._id,
      type: c.type,
      description: c.description,
      location: c.location,
      coordinates: c.coordinates,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      aiAnalysis: c.aiAnalysis,
      assignedDepartment: c.assignedDepartment ? {
        id: c.assignedDepartment._id,
        name: c.assignedDepartment.name
      } : null,
      assignedOfficer: c.assignedOfficer ? {
        id: c.assignedOfficer._id,
        name: c.assignedOfficer.name,
        email: c.assignedOfficer.email
      } : null,
      citizen: c.citizen ? {
        id: c.citizen._id,
        name: c.citizen.name,
        phone: c.citizen.phone,
        email: c.citizen.email
      } : null,
      photoPath: c.photoPath,
      photoUrl: c.photoPath
        ? `http://localhost:5000/${c.photoPath.replace(/\\/g, "/")}`
        : null,
    }));

    res.json({ 
      complaints: formatted,
      count: formatted.length 
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/complaints/:id
 * @desc    Get complaint details
 * @access  Private (Admin)
 */
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name phone email')
      .populate('assignedDepartment', 'name description')
      .populate('assignedOfficer', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      complaint: {
        ...complaint.toObject(),
        photoUrl: complaint.photoPath
          ? `http://localhost:5000/${complaint.photoPath.replace(/\\/g, "/")}`
          : null,
      }
    });
  } catch (error) {
    console.error('Get complaint details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
