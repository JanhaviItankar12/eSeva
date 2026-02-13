import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  action: { type: String, enum: ["FORWARDED","APPROVED","REJECTED","CORRECTION_REQUIRED"], required: true },
  fromOffice: { type: String },
  toOffice: { type: String },
  actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String },
  remarks: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("StatusHistory", statusHistorySchema);

