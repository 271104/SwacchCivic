// middleware/auth.js
const jwt = require("jsonwebtoken");
const Citizen = require("../models/Citizen");
const Officer = require("../models/Officer");

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log('🔐 Auth Middleware - Headers:', {
    authorization: authHeader ? 'Present' : 'Missing',
    path: req.path,
    method: req.method
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ Auth Middleware - No token provided');
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    console.log('✅ Auth Middleware - Token decoded:', {
      userId: decoded.userId,
      role: decoded.role,
      path: req.path
    });

    // Find user in appropriate collection based on role
    let user;
    if (decoded.role === 'citizen') {
      user = await Citizen.findById(decoded.userId);
      
      if (!user) {
        console.log('❌ Citizen not found');
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.isActive) {
        console.log('❌ Citizen account is inactive');
        return res.status(403).json({ message: "Account is inactive" });
      }
    } else if (decoded.role === 'officer') {
      user = await Officer.findById(decoded.userId).populate('department');
      
      if (!user) {
        console.log('❌ Officer not found');
        return res.status(401).json({ message: "User not found" });
      }

      if (user.status !== 'active') {
        console.log('❌ Officer account is not active:', user.status);
        return res.status(403).json({ 
          message: `Account is ${user.status}. Please contact admin.` 
        });
      }
    } else {
      console.log('❌ Invalid role:', decoded.role);
      return res.status(401).json({ message: "Invalid user role" });
    }

    req.user = user;
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    console.log('✅ Auth successful - User:', user.name, 'Role:', decoded.role);
    next();
  } catch (err) {
    console.log('❌ Auth Middleware - Token verification failed:', err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
