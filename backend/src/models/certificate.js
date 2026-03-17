import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({

  // 🔹 Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,   // e.g., BIRTH, CASTE
    maxlength: 10
  },

  description: {
    type: String,
    required: true
  },

  authority: {
    type: String,
    required: true
  },

  validFor: {
    type: String,
    required: true
  },

  // 🔹 Processing Configuration
  processingLevel: {
    type: String,
    enum: ["GRAM", "TEHSIL", "DISTRICT"],
    required: true
  },

  hierarchy: [
    {
      level: {
        type: String,
        enum: ["GRAM", "TEHSIL", "DISTRICT"],
        required: true
      },

      officers: [
        {
          type: String,
          enum: [
            "GRAM_SEVAK",
            "SARPANCH",
            "TEHSIL_CLERK",
            "TEHSILDAR",
            "DISTRICT_CLERK",
            "COLLECTOR"
          ]
        }
      ],

      canApprove: {
        type: Boolean,
        default: false
      }
    }
  ],

  //  SLA & Fee
  slaDays: {
    type: Number,
    required: true,
    min: 1
  },

  fee: {
    type: Number,
    required: true,
    min: 0
  },

  feeType: {
    type: String,
    enum: ["Fixed", "Variable", "Urgent Only"],
    default: "Fixed"
  },

  //  Required Documents
  requiredDocs: [
    {
      name: { type: String, required: true },

      maxSize: { type: String },  // e.g., 5MB

      formats: [
        {
          type: String,
          enum: ["PDF", "JPG", "PNG", "JPEG", "DOC", "DOCX"]
        }
      ],

      required: {
        type: Boolean,
        default: true
      }
    }
  ],

  //  Rejection Reasons
  rejectionReasons: [
    {
      type: String
    }
  ],

  //  Status
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);



