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
  maxFileSize: Number,
  allowedFileTypes: [String],
  maxFilesPerApplication: Number,
  enableCompression: Boolean,
  storageLocation: {
    type: String,
    enum: ["local", "cloud", "both"]
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
  defaultSLADays: Number,
  enableUrgent: Boolean,
  urgentFeeMultiplier: Number,
  reminderDays: Number,
  escalationDays: Number,
  workingDays: [String],

  // Registration
  allowPublicRegistration: Boolean,
  emailVerification: {
    type: String,
    enum: ["required", "optional", "none"]
  },
  mobileVerification: {
    type: String,
    enum: ["required", "optional", "none"]
  },
  defaultRole: String,
  autoApproveCitizens: Boolean,

  // Localization
  defaultLanguage: String,
  enableMultiLanguage: Boolean,
  currency: String,
  numberFormat: String,

  // Appearance
  themeColor: String,
  logo: String,
  favicon: String,
  footerText: String,

  // Performance
  cacheDuration: Number,
  paginationLimit: Number,
  dashboardRefresh: Number,
  enableLogging: Boolean,
  logRetention: Number,

  // Backup
  enableAutoBackup: Boolean,
  backupFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"]
  },
  backupTime: String,
  backupRetention: Number,
  backupLocation: {
    type: String,
    enum: ["local", "cloud", "both"]
  },

  // Notifications
  enableEmailNotifications: Boolean,
  enableSMSNotifications: Boolean,
  enableInAppNotifications: Boolean,
  notifyStatusChange: Boolean,
  notifyApproval: Boolean,
  notifyRejection: Boolean,

  // Maintenance
  maintenanceMode: Boolean,
  maintenanceMessage: String,
  allowAdminsDuringMaintenance: Boolean,

  rejectionTemplates: [
  {
    title: String,
    message: String
  }
],

approvalTemplates: [
  {
    title: String,
    message: String
  }
],

}, { timestamps: true });

export default mongoose.model("SystemSetting", systemSettingsSchema);

