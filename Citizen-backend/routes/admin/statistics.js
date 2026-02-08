// routes/admin/statistics.js
const express = require('express');
const router = express.Router();
const Officer = require('../../models/Officer');
const Citizen = require('../../models/Citizen');
const Department = require('../../models/Department');
const Complaint = require('../../models/Complaint');
const adminAuth = require('../../middleware/adminAuth');

/**
 * @route   GET /api/admin/stats/overview
 * @desc    Get system-wide statistics
 * @access  Private (Admin)
 */
router.get('/overview', adminAuth, async (req, res) => {
  try {
    // Get counts
    const totalCitizens = await Citizen.countDocuments({});
    const totalOfficers = await Officer.countDocuments({ status: 'active' });
    const pendingOfficers = await Officer.countDocuments({ status: 'pending' });
    const totalDepartments = await Department.countDocuments({ isActive: true });
    
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in_progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'rejected' });

    // Complaints by type
    const complaintsByType = await Complaint.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Complaints by priority
    const complaintsByPriority = await Complaint.aggregate([
      {
        $group: {
          _id: '$aiAnalysis.priorityLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent complaints (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentComplaints = await Complaint.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      users: {
        totalCitizens,
        totalOfficers,
        pendingOfficers
      },
      departments: {
        total: totalDepartments
      },
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints,
        recentWeek: recentComplaints,
        resolutionRate: totalComplaints > 0 
          ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) 
          : 0
      },
      complaintsByType,
      complaintsByPriority
    });
  } catch (error) {
    console.error('Get overview stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/stats/departments
 * @desc    Get statistics for all departments
 * @access  Private (Admin)
 */
router.get('/departments', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const departments = await Department.find({ isActive: true });

    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const query = { assignedDepartment: dept._id };
        if (Object.keys(dateFilter).length > 0) {
          query.createdAt = dateFilter;
        }

        const totalComplaints = await Complaint.countDocuments(query);
        const pendingComplaints = await Complaint.countDocuments({ ...query, status: 'pending' });
        const inProgressComplaints = await Complaint.countDocuments({ ...query, status: 'in_progress' });
        const resolvedComplaints = await Complaint.countDocuments({ ...query, status: 'resolved' });
        const rejectedComplaints = await Complaint.countDocuments({ ...query, status: 'rejected' });

        // Calculate average resolution time
        const resolvedWithTime = await Complaint.find({
          ...query,
          status: 'resolved'
        }).select('createdAt updatedAt');

        let avgResolutionTime = 0;
        if (resolvedWithTime.length > 0) {
          const totalTime = resolvedWithTime.reduce((sum, complaint) => {
            const time = complaint.updatedAt - complaint.createdAt;
            return sum + time;
          }, 0);
          avgResolutionTime = Math.round(totalTime / resolvedWithTime.length / (1000 * 60 * 60)); // in hours
        }

        const activeOfficers = await Officer.countDocuments({
          department: dept._id,
          status: 'active'
        });

        return {
          departmentId: dept._id,
          departmentName: dept.name,
          complaintTypes: dept.complaintTypes,
          totalComplaints,
          pendingComplaints,
          inProgressComplaints,
          resolvedComplaints,
          rejectedComplaints,
          resolutionRate: totalComplaints > 0 
            ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) 
            : 0,
          avgResolutionTimeHours: avgResolutionTime,
          activeOfficers
        };
      })
    );

    res.json({ departments: departmentStats });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/stats/departments/:id
 * @desc    Get detailed statistics for specific department
 * @access  Private (Admin)
 */
router.get('/departments/:id', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const query = { assignedDepartment: department._id };
    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    // Complaints over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaintsOverTime = await Complaint.aggregate([
      {
        $match: {
          assignedDepartment: department._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Status distribution
    const statusDistribution = await Complaint.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Priority distribution
    const priorityDistribution = await Complaint.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$aiAnalysis.priorityLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Officer performance in this department
    const officers = await Officer.find({
      department: department._id,
      status: 'active'
    }).select('-password');

    const officerPerformance = await Promise.all(
      officers.map(async (officer) => {
        const totalAssigned = await Complaint.countDocuments({
          assignedOfficer: officer._id
        });

        const resolved = await Complaint.countDocuments({
          assignedOfficer: officer._id,
          status: 'resolved'
        });

        return {
          officerId: officer._id,
          officerName: officer.name,
          totalAssigned,
          resolved,
          resolutionRate: totalAssigned > 0 
            ? ((resolved / totalAssigned) * 100).toFixed(2) 
            : 0
        };
      })
    );

    res.json({
      department: {
        id: department._id,
        name: department.name,
        description: department.description,
        complaintTypes: department.complaintTypes
      },
      complaintsOverTime,
      statusDistribution,
      priorityDistribution,
      officerPerformance
    });
  } catch (error) {
    console.error('Get department detail stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/stats/officers
 * @desc    Get statistics for all officers
 * @access  Private (Admin)
 */
router.get('/officers', adminAuth, async (req, res) => {
  try {
    const { departmentId, limit = 10 } = req.query;

    const query = { status: 'active' };
    if (departmentId) {
      query.department = departmentId;
    }

    const officers = await Officer.find(query)
      .populate('department', 'name')
      .select('-password')
      .limit(parseInt(limit));

    const officerStats = await Promise.all(
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

        // Calculate average resolution time
        const resolvedWithTime = await Complaint.find({
          assignedOfficer: officer._id,
          status: 'resolved'
        }).select('createdAt updatedAt');

        let avgResolutionTime = 0;
        if (resolvedWithTime.length > 0) {
          const totalTime = resolvedWithTime.reduce((sum, complaint) => {
            const time = complaint.updatedAt - complaint.createdAt;
            return sum + time;
          }, 0);
          avgResolutionTime = Math.round(totalTime / resolvedWithTime.length / (1000 * 60 * 60)); // in hours
        }

        return {
          officerId: officer._id,
          officerName: officer.name,
          officerEmail: officer.email,
          department: officer.department,
          totalComplaints,
          resolvedComplaints,
          pendingComplaints,
          resolutionRate: totalComplaints > 0 
            ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) 
            : 0,
          avgResolutionTimeHours: avgResolutionTime
        };
      })
    );

    // Sort by resolution rate
    officerStats.sort((a, b) => b.resolutionRate - a.resolutionRate);

    res.json({ officers: officerStats });
  } catch (error) {
    console.error('Get officer stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/stats/officers/:id
 * @desc    Get detailed statistics for specific officer
 * @access  Private (Admin)
 */
router.get('/officers/:id', adminAuth, async (req, res) => {
  try {
    const officer = await Officer.findOne({
      _id: req.params.id,
      
    })
    .populate('department', 'name complaintTypes')
    .select('-password');

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    // Complaints over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaintsOverTime = await Complaint.aggregate([
      {
        $match: {
          assignedOfficer: officer._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Status distribution
    const statusDistribution = await Complaint.aggregate([
      { $match: { assignedOfficer: officer._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Complaint type distribution
    const typeDistribution = await Complaint.aggregate([
      { $match: { assignedOfficer: officer._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        department: officer.department,
        status: officer.status
      },
      complaintsOverTime,
      statusDistribution,
      typeDistribution
    });
  } catch (error) {
    console.error('Get officer detail stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
