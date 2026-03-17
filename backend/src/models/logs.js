import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  type: String,
  category: String,
  severity: String,

  user: String,
  userName: String,

  action: String,
  description: String,

  ip: String,
  userAgent: String,

  endpoint: String,
  method: String,
  statusCode: Number,
  responseTime: Number,

  applicationId: String,
  certificateType: String,

  timestamp: {
    type: Date,
    default: Date.now
  },

  status: String
}, { timestamps: true });

export default mongoose.model("Log", logSchema);