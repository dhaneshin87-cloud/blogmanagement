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

// Add timeout middleware to prevent hanging requests
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds timeout
  res.setTimeout(30000);
});

app.use(express.json());
app.use(cors());

// OR safer option – allow specific frontend URL
app.use(cors({
  origin: "http://localhost:3000",  // your frontend URL
  credentials: true
}));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to DB first, then start server
async function startServer() {
  try {
    await connectDB(); // ensures DB is connected before server starts

    // 🔹 Ensure collections are created on startup
    await Promise.all([
      User.createCollection(),
      Post.createCollection(),
    ]);
    console.log("✅ Collections are ready");

    // API routes
    app.use("/api/user", userRoutes);
    app.use("/api/blog", postRoutes);

    const PORT = config.server.port;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
