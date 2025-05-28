// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImage: { type: String },
  credits: { type: Number, default: 50 },
  metamaskAddress: {type: String}
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
