import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use same secret
    req.user = decoded;

    next(); // ✅ continue to next middleware/route
  } catch (err) {
    console.error("JWT error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    }

    return res.status(401).json({ message: "Authentication failed" });
  }
}
