import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  // System Settings
  systemName: String,
  systemUrl: String,
  supportEmail: String,
  supportPhone: String,
  timezone: String,
  dateFormat: String,

  // Security Settings
  minPasswordLength: { type: Number, default: 8 },
  requireUppercase: Boolean,
  requireNumbers: Boolean,
  requireSpecialChars: Boolean,
  sessionTimeout: Number,
  maxLoginAttempts: Number,
  accountLockDuration: Number,
  enable2FA: Boolean,
  enableCaptcha: Boolean,

  // File Upload
  maxFileSize: { type: Number, default: 5 },
  allowedFileTypes: { type: [String], default: ["PDF", "JPG", "PNG", "JPEG", "DOC", "DOCX"] },
  maxFilesPerApplication: { type: Number, default: 5 },
  enableCompression: { type: Boolean, default: false },
  storageLocation: {
    type: String,
    enum: ["local", "cloud", "both"],
    default: "local"
  },

  // Email Settings
  smtpServer: String,
  smtpPort: Number,
  smtpUsername: String,
  smtpPassword: String,
  fromEmail: String,
  fromName: String,
  enableSSL: Boolean,

  // SMS Settings
  smsProvider: String,
  smsApiKey: String,
  smsSenderId: String,
  smsTemplate: String,
  enableSMS: Boolean,

  // SLA
  defaultSLADays: { type: Number, default: 7 },
  enableUrgent: { type: Boolean, default: true },
  urgentFeeMultiplier: { type: Number, default: 2 },
  reminderDays: { type: Number, default: 3 },
  escalationDays: { type: Number, default: 10 },
  workingDays: { type: [String], default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },

  // Fee Configuration
  feeTypes: { type: [String], default: ["Fixed", "Variable", "Urgent Only"] },

  // Registration
  allowPublicRegistration: { type: Boolean, default: true },
  emailVerification: {
    type: String,
    enum: ["required", "optional", "none"],
    default: "optional"
  },
  mobileVerification: {
    type: String,
    enum: ["required", "optional", "none"],
    default: "optional"
  },
  defaultRole: { type: String, default: "CITIZEN" },
  autoApproveCitizens: { type: Boolean, default: false },

  // Localization
  defaultLanguage: { type: String, default: "en" },
  enableMultiLanguage: { type: Boolean, default: false },
  currency: { type: String, default: "INR" },
  numberFormat: { type: String, default: "en-IN" },

  // Appearance
  themeColor: { type: String, default: "#3B82F6" },
  logo: String,
  favicon: String,
  footerText: String,

  // Performance
  cacheDuration: { type: Number, default: 300 },
  paginationLimit: { type: Number, default: 10 },
  dashboardRefresh: { type: Number, default: 60 },
  enableLogging: { type: Boolean, default: true },
  logRetention: { type: Number, default: 30 },

  // Backup
  enableAutoBackup: { type: Boolean, default: false },
  backupFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "daily"
  },
  backupTime: { type: String, default: "02:00" },
  backupRetention: { type: Number, default: 7 },
  backupLocation: {
    type: String,
    enum: ["local", "cloud", "both"],
    default: "local"
  },
  // Backup Advanced Settings
  defaultBackupLocation: { type: String, default: "/backups" },
  maxBackupSize: { type: Number, default: 100 }, // GB
  compressionLevel: {
    type: String,
    enum: ["low", "balanced", "high"],
    default: "balanced"
  },
  verifyIntegrity: { type: Boolean, default: true },

  // Restore Settings
  createRestorePoint: { type: Boolean, default: true },
  verifyAfterRestore: { type: Boolean, default: true },
  maintainDuringRestore: { type: Boolean, default: true },

  // Recovery Objectives
  rto: { type: String, default: "4" }, // Recovery Time Objective
  rpo: { type: String, default: "4" }, // Recovery Point Objective


  // Notifications
  enableEmailNotifications: { type: Boolean, default: true },
  enableSMSNotifications: { type: Boolean, default: false },
  enableInAppNotifications: { type: Boolean, default: true },
  notifyStatusChange: { type: Boolean, default: true },
  notifyApproval: { type: Boolean, default: true },
  notifyRejection: { type: Boolean, default: true },

  // Maintenance
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: String,
  allowAdminsDuringMaintenance: { type: Boolean, default: true },

  // Templates
  rejectionTemplates: [
    {
      title: { type: String, default: "Default Rejection" },
      message: { type: String, default: "Your application has been rejected due to incomplete information." }
    }
  ],
  approvalTemplates: [
    {
      title: { type: String, default: "Default Approval" },
      message: { type: String, default: "Your application has been approved successfully." }
    }
  ],

}, { timestamps: true });

export default mongoose.model("SystemSetting", systemSettingsSchema);

