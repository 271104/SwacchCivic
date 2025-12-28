// // middleware/auth.js
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];

//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ message: "No token provided. Authorization denied." });
//     }

//     const parts = authHeader.split(" ");

//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res
//         .status(401)
//         .json({ message: "Token format must be: Bearer <token>" });
//     }

//     const token = parts[1];

//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Attach to request
//     req.userId = decoded.userId;
//     req.userRole = decoded.role;

//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");

// exports.protect = (allowedRoles = []) => {
//   return (req, res, next) => {
//     let token;

//     // 1️⃣ Get token from header
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // 2️⃣ If no token
//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     try {
//       // 3️⃣ Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // decoded contains: userId, role
//       req.user = decoded;

//       // 4️⃣ Check role
//       if (
//         allowedRoles.length > 0 &&
//         !allowedRoles.includes(decoded.role)
//       ) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Token invalid or expired" });
//     }
//   };
// };

const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.role; // ✅ REQUIRED

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
