import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },
    bio: { type: String },
    profileImage: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);
