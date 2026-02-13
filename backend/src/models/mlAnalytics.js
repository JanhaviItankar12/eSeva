import mongoose from "mongoose";

const mlAnalyticsSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  predictedDelayRisk: { type: String, enum: ["LOW","MEDIUM","HIGH"], required: true },
  reason: { type: String },
  predictedAt: { type: Date, default: Date.now }
});

export default mongoose.model("MLAnalytics", mlAnalyticsSchema);

