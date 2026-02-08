// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware to verify admin authentication and authorization
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find admin
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(401).json({ 
        message: 'Invalid token. Admin not found.' 
      });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(403).json({ 
        message: 'Access denied. Admin account is not active.' 
      });
    }

    // Attach admin to request
    req.user = admin;
    req.userId = admin._id;
    req.role = 'admin';

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = adminAuth;
