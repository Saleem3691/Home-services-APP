import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer",
  },
  avatar: {
    type: String,
    default: "/default-avatar.png",
  },
  phone: String,
  businessName: String,
  location: String,
  experience: Number,
  services: [String],
  description: String,
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  verificationDocuments: [String],
  availability: {
    type: String,
    enum: ["available", "busy", "unavailable"],
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
