import mongoose from "mongoose";

const backupSchema = new mongoose.Schema({
  fileName: String,
  size: String,
  type: { type: String, enum: ["manual", "auto"] },
  status: { type: String, enum: ["success", "failed"] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Backup", backupSchema);
