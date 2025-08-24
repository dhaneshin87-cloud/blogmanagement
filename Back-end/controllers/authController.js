import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "User already exists" });

      let assignedRole = "user";

      // Allow first admin if none exists yet
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists && role === "admin") {
        assignedRole = "admin";
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
      });


      res.status(201).json({
        status: 'success',
        message: 'User registered successfully'
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      let payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Set refreshToken in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      const responseData = {
        status: 'success',
        accessToken,
        user: payload
      };
      res.status(200).json(responseData);
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  refresh: (req, res) => {
    res.status(200).json({ message: "Token refreshed (placeholder)" });
  },

  logout: (req, res) => {
    res.status(200).json({ message: "Logged out (placeholder)" });
  },
};

export default authController;
