import mongoose from "mongoose";
 
const scheduleSchema = new mongoose.Schema({
  name: String,
  type: String,
  frequency: String, // daily / weekly / monthly
  time: String,
  day: String,

  databases: [String],
  retention: String,

  status: { type: String, default: "active" },

  lastRun: Date,
  nextRun: Date,

  compression: Boolean,
  encryption: Boolean,
  notification: Boolean
});

export default mongoose.model("Schedule", scheduleSchema);