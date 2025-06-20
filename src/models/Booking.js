// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);