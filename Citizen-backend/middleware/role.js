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
    if (!req.userRole) {
      return res.status(401).json({ message: "User role missing" });
    }

    if (req.userRole !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
