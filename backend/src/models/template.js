// models/exportTemplateModel.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: String,
  type: String,
  fields: [String],
  createdBy: String
}, { timestamps: true });

export default mongoose.model("ExportTemplate", templateSchema);