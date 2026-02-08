// middleware/role.js

// usage: requireRole("citizen") or requireRole("officer")
// module.exports = function requireRole(...allowedRoles) {
//   return (req, res, next) => {
//     if (!req.userRole || !allowedRoles.includes(req.userRole)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

// middleware/role.js
module.exports = function requireRole(role) {
  return function (req, res, next) {
    console.log('Role Middleware - Checking role:', {
      required: role,
      actual: req.userRole,
      userId: req.userId,
      path: req.path
    });

    if (!req.userRole) {
      console.log('Role Middleware - User role missing');
      return res.status(401).json({ message: "User role missing" });
    }

    if (req.userRole !== role) {
      console.log('Role Middleware - Access denied:', {
        required: role,
        actual: req.userRole
      });
      return res.status(403).json({ message: "Access denied" });
    }

    console.log('Role Middleware - Access granted');
    next();
  };
};
