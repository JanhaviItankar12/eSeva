// models/exportModel.js
import mongoose from "mongoose";

const exportSchema = new mongoose.Schema({
  name: String,
  type: String, // users, backups, notifications
  format: String, // csv, json
  filePath: String,
  size: Number,
  createdBy: String
}, { timestamps: true });

export default mongoose.model("Export", exportSchema);