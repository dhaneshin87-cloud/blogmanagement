export default function roleMiddleware(allowedRoles) {
  return function (handler) {
    return async (req, res, next) => {
      try {
        const user = req.user; // already set by authMiddleware
        if (!user || !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        
        // If handler is provided, call it, otherwise continue to next middleware
        if (handler) {
          return await handler(req, res, next);
        } else {
          next();
        }
      } catch (err) {
        console.error("Role middleware error:", err);
        return res.status(403).json({ message: "Forbidden" });
      }
    };
  };
}
