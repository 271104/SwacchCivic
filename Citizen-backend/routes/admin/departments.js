// routes/admin/departments.js
const express = require('express');
const router = express.Router();
const Department = require('../../models/Department');
const Officer = require('../../models/Officer');
const Complaint = require('../../models/Complaint');
const adminAuth = require('../../middleware/adminAuth');

/**
 * @route   GET /api/admin/departments
 * @desc    Get all departments
 * @access  Private (Admin)
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    // Get officer count for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const officerCount = await Officer.countDocuments({
          department: dept._id,
          role: 'officer',
          status: 'active'
        });

        const complaintCount = await Complaint.countDocuments({
          assignedDepartment: dept._id
        });

        return {
          id: dept._id,
          name: dept.name,
          description: dept.description,
          complaintTypes: dept.complaintTypes,
          isActive: dept.isActive,
          officerCount,
          complaintCount,
          createdAt: dept.createdAt,
          updatedAt: dept.updatedAt
        };
      })
    );

    res.json({ departments: departmentsWithCounts });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/departments/:id
 * @desc    Get department by ID
 * @access  Private (Admin)
 */
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Get officers in this department
    const officers = await Officer.find({
      department: department._id,
      role: 'officer'
    }).select('-password');

    // Get complaint statistics
    const totalComplaints = await Complaint.countDocuments({
      assignedDepartment: department._id
    });

    const pendingComplaints = await Complaint.countDocuments({
      assignedDepartment: department._id,
      status: 'pending'
    });

    const resolvedComplaints = await Complaint.countDocuments({
      assignedDepartment: department._id,
      status: 'resolved'
    });

    res.json({
      department: {
        id: department._id,
        name: department.name,
        description: department.description,
        complaintTypes: department.complaintTypes,
        isActive: department.isActive,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt
      },
      officers,
      statistics: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        officerCount: officers.length
      }
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/departments
 * @desc    Create new department
 * @access  Private (Admin)
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, complaintTypes } = req.body;

    // Validate input
    if (!name || !complaintTypes || complaintTypes.length === 0) {
      return res.status(400).json({ 
        message: 'Name and complaint types are required' 
      });
    }

    // Check if department already exists
    const existingDept = await Department.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingDept) {
      return res.status(400).json({ 
        message: 'Department with this name already exists' 
      });
    }

    // Create department
    const department = new Department({
      name,
      description,
      complaintTypes,
      isActive: true
    });

    await department.save();

    res.status(201).json({
      message: 'Department created successfully',
      department: {
        id: department._id,
        name: department.name,
        description: department.description,
        complaintTypes: department.complaintTypes,
        isActive: department.isActive
      }
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/departments/:id
 * @desc    Update department
 * @access  Private (Admin)
 */
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, complaintTypes, isActive } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Update fields
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (complaintTypes) department.complaintTypes = complaintTypes;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    res.json({
      message: 'Department updated successfully',
      department: {
        id: department._id,
        name: department.name,
        description: department.description,
        complaintTypes: department.complaintTypes,
        isActive: department.isActive
      }
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/departments/:id
 * @desc    Deactivate department
 * @access  Private (Admin)
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has active officers
    const activeOfficers = await Officer.countDocuments({
      department: department._id,
      role: 'officer',
      status: 'active'
    });

    if (activeOfficers > 0) {
      return res.status(400).json({ 
        message: `Cannot deactivate department with ${activeOfficers} active officers. Please reassign or deactivate officers first.` 
      });
    }

    // Deactivate instead of delete
    department.isActive = false;
    await department.save();

    res.json({
      message: 'Department deactivated successfully',
      department: {
        id: department._id,
        name: department.name,
        isActive: department.isActive
      }
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
