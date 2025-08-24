import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

export async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || "myDatabase",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose connected!");
    console.log(`Using database: ${process.env.DB_NAME || "myDatabase"}`);
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  }
}
