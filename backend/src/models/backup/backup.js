import mongoose from "mongoose";

const backupSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["auto", "manual"] },
  status: { type: String, enum: ["success", "failed", "warning"] },

  size: Number,
  duration: String,
  location: String,

  files: Number,
  databases: [String],

  createdBy: String,
  createdByName: String,

  reason: String,
  warning: String,
  error: String,

  checksum: String,
  compression: String,
  encryption: String,
  retention: String,

  timestamp: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("Backup", backupSchema);