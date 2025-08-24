import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default {
  getProfile: async (req, res) => {
    try {
      const decoded = req.user; // from middleware
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("Get profile error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const decoded = req.user;
      const { name, email, password } = req.body;

      let updateData = { name, email };
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      console.error("Get all users error:", err);
      res.status(500).json({ message: err.message });
    }
  },
  
  addUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });
      res.status(201).json({ message: "User created", user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      console.error("Add user error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      let updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated", user });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: `User ${req.params.id} deleted successfully` });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: err.message });
    }
  }
};
