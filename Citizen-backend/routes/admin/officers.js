// routes/admin/officers.js
const express = require('express');
const router = express.Router();
const Officer = require('../../models/Officer');
const Department = require('../../models/Department');
const Complaint = require('../../models/Complaint');
const adminAuth = require('../../middleware/adminAuth');

/**
 * @route   GET /api/admin/officers/pending
 * @desc    Get pending officer approvals
 * @access  Private (Admin)
 */
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const pendingOfficers = await Officer.find({
      status: 'pending'
    })
    .populate('department', 'name complaintTypes')
    .select('-password')
    .sort({ createdAt: -1 });

    res.json({ 
      officers: pendingOfficers,
      count: pendingOfficers.length 
    });
  } catch (error) {
    console.error('Get pending officers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/officers
 * @desc    Get all officers with filters
 * @access  Private (Admin)
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, department, search } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const officers = await Officer.find(query)
      .populate('department', 'name complaintTypes')
      .populate('approvedBy', 'name email')
      .select('-password')
      .sort({ createdAt: -1 });

    // Get complaint counts for each officer
    const officersWithStats = await Promise.all(
      officers.map(async (officer) => {
        const totalComplaints = await Complaint.countDocuments({
          assignedOfficer: officer._id
        });

        const resolvedComplaints = await Complaint.countDocuments({
          assignedOfficer: officer._id,
          status: 'resolved'
        });

        const pendingComplaints = await Complaint.countDocuments({
          assignedOfficer: officer._id,
          status: { $in: ['pending', 'in_progress'] }
        });

        return {
          ...officer.toObject(),
          statistics: {
            totalComplaints,
            resolvedComplaints,
            pendingComplaints
          }
        };
      })
    );

    res.json({ 
      officers: officersWithStats,
      count: officersWithStats.length 
    });
  } catch (error) {
    console.error('Get officers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/officers/:id
 * @desc    Get officer details
 * @access  Private (Admin)
 */
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id)
    .populate('department', 'name complaintTypes description')
    .populate('approvedBy', 'name email')
    .select('-password');

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    // Get detailed statistics
    const totalComplaints = await Complaint.countDocuments({
      assignedOfficer: officer._id
    });

    const resolvedComplaints = await Complaint.countDocuments({
      assignedOfficer: officer._id,
      status: 'resolved'
    });

    const pendingComplaints = await Complaint.countDocuments({
      assignedOfficer: officer._id,
      status: 'pending'
    });

    const inProgressComplaints = await Complaint.countDocuments({
      assignedOfficer: officer._id,
      status: 'in_progress'
    });

    res.json({
      officer: officer.toObject(),
      statistics: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolutionRate: totalComplaints > 0 
          ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) 
          : 0
      }
    });
  } catch (error) {
    console.error('Get officer details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/officers/:id/approve
 * @desc    Approve officer
 * @access  Private (Admin)
 */
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    if (officer.status === 'active') {
      return res.status(400).json({ message: 'Officer is already approved' });
    }

    officer.status = 'active';
    officer.approvedBy = req.userId;
    officer.approvedAt = new Date();

    await officer.save();

    const updatedOfficer = await Officer.findById(officer._id)
      .populate('department', 'name')
      .populate('approvedBy', 'name email')
      .select('-password');

    res.json({
      message: 'Officer approved successfully',
      officer: updatedOfficer
    });
  } catch (error) {
    console.error('Approve officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/officers/:id/reject
 * @desc    Reject officer
 * @access  Private (Admin)
 */
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;

    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    officer.status = 'rejected';
    officer.approvedBy = req.userId;
    officer.approvedAt = new Date();

    await officer.save();

    res.json({
      message: 'Officer rejected successfully',
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        status: officer.status
      }
    });
  } catch (error) {
    console.error('Reject officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/officers/:id/revoke
 * @desc    Revoke officer access
 * @access  Private (Admin)
 */
router.put('/:id/revoke', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    if (officer.status !== 'active') {
      return res.status(400).json({ 
        message: 'Can only revoke access for active officers' 
      });
    }

    officer.status = 'inactive';
    await officer.save();

    res.json({
      message: 'Officer access revoked successfully',
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        status: officer.status
      }
    });
  } catch (error) {
    console.error('Revoke officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/officers/:id/activate
 * @desc    Reactivate officer
 * @access  Private (Admin)
 */
router.put('/:id/activate', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    if (officer.status === 'active') {
      return res.status(400).json({ message: 'Officer is already active' });
    }

    officer.status = 'active';
    await officer.save();

    res.json({
      message: 'Officer reactivated successfully',
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        status: officer.status
      }
    });
  } catch (error) {
    console.error('Activate officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/officers/:id/department
 * @desc    Change officer's department
 * @access  Private (Admin)
 */
router.put('/:id/department', adminAuth, async (req, res) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    // Verify department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (!department.isActive) {
      return res.status(400).json({ message: 'Cannot assign to inactive department' });
    }

    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    officer.department = departmentId;
    await officer.save();

    const updatedOfficer = await Officer.findById(officer._id)
      .populate('department', 'name complaintTypes')
      .select('-password');

    res.json({
      message: 'Officer department updated successfully',
      officer: updatedOfficer
    });
  } catch (error) {
    console.error('Change department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/officers/:id
 * @desc    Delete officer
 * @access  Private (Admin)
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    // Check if officer has assigned complaints
    const assignedComplaints = await Complaint.countDocuments({
      assignedOfficer: officer._id,
      status: { $in: ['pending', 'in_progress'] }
    });

    if (assignedComplaints > 0) {
      return res.status(400).json({ 
        message: `Cannot delete officer with ${assignedComplaints} active complaints. Please reassign complaints first.` 
      });
    }

    await Officer.deleteOne({ _id: officer._id });

    res.json({
      message: 'Officer deleted successfully'
    });
  } catch (error) {
    console.error('Delete officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
