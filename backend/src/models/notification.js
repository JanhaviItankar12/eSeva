import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  message: { type: String, required: true },
  type: { type: String, enum: ["EMAIL","SMS"], default: "EMAIL" },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["SENT","FAILED"], default: "SENT" }
});

export default mongoose.model("Notification", notificationSchema);

