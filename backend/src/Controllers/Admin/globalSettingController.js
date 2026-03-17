import SystemSetting from "../../models/systemSetting.js";

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      // Create default settings with all default values
      settings = await SystemSetting.create({
        // System Settings
        systemName: "eSeva",
        systemUrl: process.env.FRONTEND_URL || "http://localhost:3000",
        supportEmail: "support@eseva.gov.in",
        supportPhone: "1800-123-4567",
        timezone: "Asia/Kolkata",
        dateFormat: "DD/MM/YYYY",

        // Security Settings
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        accountLockDuration: 30,
        enable2FA: false,
        enableCaptcha: true,

        // File Upload
        maxFileSize: 5,
        allowedFileTypes: ["PDF", "JPG", "PNG", "JPEG", "DOC", "DOCX"],
        maxFilesPerApplication: 5,
        enableCompression: false,
        storageLocation: "local",

        // Email Settings (will be configured later)
        smtpServer: "",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
        fromEmail: "janu121005@gmail.com",
        fromName: "eSeva System",
        enableSSL: true,

        // SMS Settings
        smsProvider: "",
        smsApiKey: "",
        smsSenderId: "eSeva",
        smsTemplate: "Your OTP is {otp}",
        enableSMS: false,

        // SLA
        defaultSLADays: 7,
        enableUrgent: true,
        urgentFeeMultiplier: 2,
        reminderDays: 3,
        escalationDays: 10,
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

        // Fee Configuration
        feeTypes: ["Fixed", "Variable", "Urgent Only"],

        // Registration
        allowPublicRegistration: true,
        emailVerification: "optional",
        mobileVerification: "optional",
        defaultRole: "CITIZEN",
        autoApproveCitizens: false,

        // Localization
        defaultLanguage: "en",
        enableMultiLanguage: false,
        currency: "INR",
        numberFormat: "en-IN",

        // Appearance
        themeColor: "#3B82F6",
        logo: "",
        favicon: "",
        footerText: "© 2026 eSeva. All rights reserved.",

        // Performance
        cacheDuration: 300,
        paginationLimit: 10,
        dashboardRefresh: 60,
        enableLogging: true,
        logRetention: 30,

        // Backup
        enableAutoBackup: false,
        backupFrequency: "daily",
        backupTime: "02:00",
        backupRetention: 7,
        backupLocation: "local",

        // Notifications
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        enableInAppNotifications: true,
        notifyStatusChange: true,
        notifyApproval: true,
        notifyRejection: true,

        // Maintenance
        maintenanceMode: false,
        maintenanceMessage: "System is under maintenance. Please try again later.",
        allowAdminsDuringMaintenance: true,

        // Templates
        rejectionTemplates: [
          {
            title: "Incomplete Documents",
            message: "Your application has been rejected due to incomplete or missing documents. Please submit all required documents and reapply."
          },
          {
            title: "Incorrect Information",
            message: "The information provided in your application is incorrect. Please verify and correct the details."
          },
          {
            title: "Not Eligible",
            message: "You do not meet the eligibility criteria for this certificate/service."
          }
        ],
        approvalTemplates: [
          {
            title: "Application Approved",
            message: "Your application has been approved. You can download the certificate from your dashboard."
          },
          {
            title: "Verification Complete",
            message: "Your documents have been verified successfully. Your application is now approved."
          }
        ]
      });
    }

    return res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error fetching system settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error: error.message
    });
  }
};

// Update system settings
export const updateSystemSetting = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = new SystemSetting();
    }

    // Update only the fields that are provided in the request
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'System settings updated successfully',
      data: settings
    });

  } catch (error) {
    console.error('Error updating system settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error: error.message
    });
  }
};

