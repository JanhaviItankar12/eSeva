import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true }, // Public tracking ID
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateType: { 
    type: String,
    enum: ["BIRTH", "RESIDENCE", "INCOME", "CASTE", "DOMICILE"],
    required: true
  },

  certificateId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Certificate",
  required: true
},



  certificateData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  currentStatus: {
    type: String, 
    enum: ["DRAFT","SUBMITTED","UNDER_VERIFICATION","CORRECTION_REQUIRED","RE-VERIFY","APPROVED","REJECTED"], 
    default: "SUBMITTED" ,
  },
  currentOfficeLevel: { type: String, enum: ["GRAM", "TEHSIL", "DISTRICT"] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Officer
  documents: [
    {
      documentType: { type: String },
      fileUrl: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      uploadedAt: { type: Date, default: Date.now },
      isVerified: { type: Boolean, default: false }
    }
  ],

 smsSubscriptions: [
  {
    mobile: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    subscribedAt: { type: Date, default: Date.now },
    lastNotified: { type: Date, default: null },
    unsubscribedAt: { type: Date }
  }
]
,

whatsappSubscriptions: [
  {
    mobile: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    subscribedAt: { type: Date, default: Date.now },
    lastNotified: { type: Date, default: null },
    unsubscribedAt: { type: Date }
  }
]
,






  issueUrgency: {
    type: String,
    enum: ["normal", "urgent",],
    default: "normal"
  },

  jurisdiction: {
    district: { type: String, required: true },
    tehsil: { type: String, required: true },
    village: {
      type: String, required: true
    },
  },

  approvalFlow: {
  type: [String],
  required: true
},
currentApprovalIndex: {
  type: Number,
  default: 0
},

  rejectionReason: { type: String },
  correctionMessage: { type: String },
  appliedDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  expectedCompletionDate: { type: Date } // Used for ML delay prediction
});

export default mongoose.model("Application", applicationSchema);

