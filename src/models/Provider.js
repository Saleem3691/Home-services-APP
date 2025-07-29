// models/Provider.js
import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  phone: { type: String, required: false },
  location: { type: String, required: true },
  experience: { type: Number, required: true },
  services: { type: [String], required: false },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.providers || mongoose.model('providers', providerSchema);