import mongoose from "mongoose";

const restoreBackupSchema = new mongoose.Schema({
  backupId: String,
  performedBy: String,
  performedByName: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("RestoreBackup", restoreBackupSchema);

