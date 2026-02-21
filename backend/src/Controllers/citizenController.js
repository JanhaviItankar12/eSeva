import mongoose from "mongoose";
import { certificateFlow } from "../config/certificateFlow.js";
import Application from "../models/application.js";
import StatusHistory from "../models/statusHistory.js";
import User from "../models/user.js";
import { sendSMS } from "../service/SendSMS.js";
import { sendWhatsApp } from "../service/whatsappMessage.js";

export const getCitizeninfo = async (req, res) => {
  try {

    const id = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Citizen ID is required" });
    }

    const citizen = await User.findById(id);

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    // Send citizen info
    res.status(200).json({ citizen });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const updateAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const { address } = req.body;



    // Validate address
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address data is required'
      });
    }

    const { village, tehsil, district } = address.address;


    if (!village?.trim() || !tehsil?.trim() || !district?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Village, Tehsil, and District are required fields'
      });
    }

    // Find citizen and update only address
    const citizen = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          'address.village': village.trim(),
          'address.tehsil': tehsil.trim(),
          'address.district': district.trim()
        }
      },
      {
        new: true,  // Return updated document
        runValidators: true,  // Run schema validations
        select: '-password -otp -otpExpires -tempPasswordExpires'  // Exclude sensitive fields
      }
    );


    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: citizen.address
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { password } = req.body.password;

    // Validate password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    // Find citizen first
    const citizen = await User.findById(id);


    // Update password - pre('save') middleware will auto-hash it
    citizen.password = password;
    citizen.isFirstLogin = false;
    citizen.tempPasswordExpires = null;

    // Save will trigger the pre('save') hook and hash the password
    await citizen.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const id = req.user.id;   // this is citizenId

    const citizenApplications = await Application.find({
      citizenId: id
    });


    return res.status(200).json({
      message: "All Application data fetched..",
      citizenApplications
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server Error"
    });
  }
};


export const getDatafortrackApplication = async (req, res) => {

  const decodedApplicationId = decodeURIComponent(req.params.applicationId);


  const application = await Application.findOne({
    applicationId: decodedApplicationId,
    citizenId: req.user.id
  });
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const history = await StatusHistory.find({
    applicationId: application._id
  }).sort({ timestamp: 1 });

  const flow = certificateFlow[application.certificateType].flow;

  const timeline = flow.map((role, index) => {
    const historyEntry = history.find(h => h.role === role);

    if (historyEntry) {
      return {
        level: role,
        status: historyEntry.action,
        updatedAt: historyEntry.timestamp,
        remark: historyEntry.remarks || null
      };
    }

    if (index < application.currentApprovalIndex) {
      return { level: role, status: "COMPLETED" };
    }

    if (index === application.currentApprovalIndex) {
      return { level: role, status: "IN_PROGRESS" };
    }

    return { level: role, status: "PENDING" };
  });

  return res.json({
    applicationId: application.applicationId,
    certificateType: application.certificateType,
    appliedDate: application.appliedDate,
    currentStatus: application.currentStatus,
    currentOfficeLevel: application.currentOfficeLevel,
    expectedCompletionDate: application.expectedCompletionDate,
    issueUrgency: application.issueUrgency,
    jurisdiction: application.jurisdiction,
    approvalTimeline: timeline,
    documents: application.documents.map(doc => ({
      name: doc.documentType,
      status: doc.isVerified ? "VERIFIED" : "PENDING_VERIFICATION"
    })),
    correctionRequired: {
      isRequired: application.currentStatus === "CORRECTION_REQUIRED",
      reason: application.correctionMessage || null
    },
    rejectionDetails: {
      isRejected: application.currentStatus === "REJECTED",
      reason: application.rejectionReason || null
    }
  });
};




export const subscribeToSMS = async (req, res) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id;

    if (!decodedApplicationId) {
      throw new Error("Application ID is required");
    }

    // 🔹 Attach session
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.mobile) {
      throw new Error("No mobile number found in profile");
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(user.mobile)) {
      throw new Error("Invalid mobile number format");
    }

    const application = await Application.findOne({
      applicationId: decodedApplicationId
    }).session(session);

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.citizenId.toString() !== userId.toString()) {
      throw new Error("Unauthorized access");
    }

    application.smsSubscriptions =
      application.smsSubscriptions || [];

    const existingSubscription =
      application.smsSubscriptions.find(
        sub => sub.mobile === user.mobile
      );

    if (existingSubscription && existingSubscription.isActive) {
      throw new Error("Already subscribed");
    }

    if (existingSubscription && !existingSubscription.isActive) {
      existingSubscription.isActive = true;
      existingSubscription.subscribedAt = new Date();
      existingSubscription.unsubscribedAt = null;
    } else {
      application.smsSubscriptions.push({
        mobile: user.mobile,
        subscribedAt: new Date(),
        isActive: true,
        lastNotified: null
      });
    }

    // 🔹 Save with session
    await application.save({ session });

    // 🔹 External SMS API
    await sendSMS(
      user.mobile,
      `You have successfully subscribed to updates for Application ${decodedApplicationId}. - eSeva`
    );

    // 🔹 Commit if everything successful
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to SMS updates"
    });

  } catch (error) {

    await session.abortTransaction();

    console.error("Transaction Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });

  } finally {
    session.endSession();
  }
};

export const unsubscribeFromSMS = async (req, res) => {
  try {
    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id;

    if (!decodedApplicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.mobile) {
      return res.status(404).json({
        success: false,
        message: "User or mobile number not found"
      });
    }

    const application = await Application.findOne({
      applicationId: decodedApplicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.citizenId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const subscription = application.smsSubscriptions.find(
      sub => sub.mobile === user.mobile && sub.isActive
    );

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "You are not subscribed to SMS updates"
      });
    }

  
    //  Soft unsubscribe
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    application.markModified("smsSubscriptions");
    await application.save();
    

    return res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from SMS updates"
    });

  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unsubscribe",
      error: error.message
    });
  }
};

export const getSMSStatus = async (req, res) => {
  try {
    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id; // From auth middleware

    // Validation
    if (!decodedApplicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }

    // Get user details
    const user = await User.findById(userId).select('name email mobile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the application
    const application = await Application.findOne({
      applicationId: decodedApplicationId
    }).select('citizenId smsSubscriptions currentStatus certificateType');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify that the user owns this application
    if (application.citizenId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application'
      });
    }

    // Check if user has mobile number
    const hasMobileNumber = !!user?.mobile;

    // Validate mobile number format (if exists)
    const isValidMobile = user?.mobile ? /^[6-9]\d{9}$/.test(user.mobile) : false;

    // Check if already subscribed
    let isSubscribed = false;
    let subscriptionDetails = null;

    if (application.smsSubscriptions && user?.mobile) {
      const subscription = application.smsSubscriptions.find(
        sub => sub.mobile === user.mobile && sub.isActive === true
      );

      if (subscription) {
        isSubscribed = true;
        subscriptionDetails = {
          subscribedAt: subscription.subscribedAt,
          lastNotified: subscription.lastNotified
        };
      }
    }

    // Mask mobile number for privacy
    const maskMobile = (mobile) => {
      if (!mobile) return null;
      return mobile.slice(0, 2) + '*****' + mobile.slice(-3);
    };

    return res.status(200).json({
      success: true,
      data: {
        hasMobileNumber: hasMobileNumber && isValidMobile,
        isSubscribed,
        mobile: maskMobile(user?.mobile),
        isValidMobile,
        subscriptionDetails,
        canSubscribe: (hasMobileNumber && isValidMobile && !isSubscribed),
        applicationDetails: {
          applicationId: application.applicationId,
          certificateType: application.certificateType,
          currentStatus: application.currentStatus
        }
      }
    });

  } catch (error) {
    console.error('SMS Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get SMS status',
      error: error.message
    });
  }
};


export const subscribeToWHATSAPP = async (req, res) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id;

    if (!decodedApplicationId) {
      throw new Error("Application ID is required");
    }

    // 🔹 IMPORTANT: session attach karna zaroori hai
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.mobile) {
      throw new Error("No mobile number found in profile");
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(user.mobile)) {
      throw new Error("Invalid mobile number format");
    }

    const application = await Application.findOne({
      applicationId: decodedApplicationId
    }).session(session);

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.citizenId.toString() !== userId.toString()) {
      throw new Error("Unauthorized access");
    }

    application.whatsappSubscriptions =
      application.whatsappSubscriptions || [];

    const existingSubscription =
      application.whatsappSubscriptions.find(
        sub => sub.mobile === user.mobile
      );

    if (existingSubscription && existingSubscription.isActive) {
      throw new Error("Already subscribed");
    }

    if (existingSubscription && !existingSubscription.isActive) {
      existingSubscription.isActive = true;
      existingSubscription.subscribedAt = new Date();
      existingSubscription.unsubscribedAt = null;
    } else {
      application.whatsappSubscriptions.push({
        mobile: user.mobile,
        subscribedAt: new Date(),
        isActive: true,
        lastNotified: null
      });
    }

    // 🔹 SAVE WITH SESSION
    await application.save({ session });

    // 🔹 External API Call
    await sendWhatsApp(
      user.mobile,
      `You have successfully subscribed to updates for Application ${decodedApplicationId}. - eSeva`
    );

    // 🔹 Commit if everything successful
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to WhatsApp updates"
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    console.error("Transaction Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const unsubscribeFromWHATSAPP = async (req, res) => {
  try {
    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id;

    if (!decodedApplicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.mobile) {
      return res.status(404).json({
        success: false,
        message: "User or mobile number not found"
      });
    }

    const application = await Application.findOne({
      applicationId: decodedApplicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.citizenId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const subscription = application.whatsappSubscriptions.find(
      sub => sub.mobile === user.mobile && sub.isActive
    );

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "You are not subscribed to Whatsapp updates"
      });
    }

    //  Soft unsubscribe
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    application.markModified("whatsappSubscriptions");
    await application.save();
    

    return res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from Whatsapp updates"
    });

  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unsubscribe",
      error: error.message
    });
  }
};

export const getWhatsappStatus = async (req, res) => {
  try {
    const decodedApplicationId = decodeURIComponent(req.params.applicationId);
    const userId = req.user.id; // From auth middleware

    // Validation
    if (!decodedApplicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }

    // Get user details
    const user = await User.findById(userId).select('name email mobile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the application
    const application = await Application.findOne({
      applicationId: decodedApplicationId
    }).select('citizenId whatsappSubscriptions currentStatus certificateType');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify that the user owns this application
    if (application.citizenId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application'
      });
    }

    // Check if user has mobile number
    const hasMobileNumber = !!user?.mobile;

    // Validate mobile number format (if exists)
    const isValidMobile = user?.mobile ? /^[6-9]\d{9}$/.test(user.mobile) : false;

    // Check if already subscribed
    let isSubscribed = false;
    let subscriptionDetails = null;

    if (application.whatsappSubscriptions && user?.mobile) {
      const subscription = application.whatsappSubscriptions.find(
        sub => sub.mobile === user.mobile && sub.isActive === true
      );

      if (subscription) {
        isSubscribed = true;
        subscriptionDetails = {
          subscribedAt: subscription.subscribedAt,
          lastNotified: subscription.lastNotified
        };
      }
    }

    // Mask mobile number for privacy
    const maskMobile = (mobile) => {
      if (!mobile) return null;
      return mobile.slice(0, 2) + '*****' + mobile.slice(-3);
    };

    return res.status(200).json({
      success: true,
      data: {
        hasMobileNumber: hasMobileNumber && isValidMobile,
        isSubscribed,
        mobile: maskMobile(user?.mobile),
        isValidMobile,
        subscriptionDetails,
        canSubscribe: (hasMobileNumber && isValidMobile && !isSubscribed),
        applicationDetails: {
          applicationId: application.applicationId,
          certificateType: application.certificateType,
          currentStatus: application.currentStatus
        }
      }
    });

  } catch (error) {
    console.error('Whatsapp Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get Whatsapp status',
      error: error.message
    });
  }
};











