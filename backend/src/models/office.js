import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  officeName: { type: String, required: true },
  officeLevel: { type: String, enum: ["GRAM", "TEHSIL", "DISTRICT"], required: true },
  address: { type: String },
  district: { type: String },
  tehsil: { type: String },
  village: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Office", officeSchema);
