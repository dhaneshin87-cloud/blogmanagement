import express from "express";
import { connectDB } from "./config/databaseconnection.js";
import config from "./config/config.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// Import models
import { User, Profile, Post } from "./models/index.js";
import cors from "cors";

const app = express();

// 🔹 Use PORT from environment (Render sets this)
const PORT = process.env.PORT || 5000;

// Timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30s
  res.setTimeout(30000);
  next();
});

// JSON + CORS
app.use(express.json());
app.use(cors({
  origin: "https://blogmanagement-c2gn.vercel.app",  // your frontend
  credentials: true
}));

// Root route for health check
app.get("/", (req, res) => res.send("Server is running"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", postRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server after DB connection
async function startServer() {
  try {
    await connectDB();
    
    // Ensure collections exist
    await Promise.all([User.createCollection(), Post.createCollection()]);
    console.log("✅ Collections ready");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
