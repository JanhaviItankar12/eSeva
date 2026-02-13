import { getTehsildar } from "./HelperFuction/getTehsildar.js";
import Application from "../models/application.js";
import StatusHistory from "../models/statusHistory.js";

export const tehsilClerkVerifyIncome = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    //  Role check
    if (req.user.role !== "TEHSIL_CLERK") {
      return res.status(403).json({
        message: "Only Tehsil Clerk allowed"
      });
    }

    //  Fetch application
    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Correct stage + assignment validation
    if (
      application.certificateType !== "INCOME" ||
      application.currentOfficeLevel !== "TEHSIL" ||
      application.currentStatus !== "UNDER_VERIFICATION" ||
      application.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({
        message: "Application not assigned to this Tehsil Clerk"
      });
    }

    //  Allowed actions
    const allowedActions = ["CORRECTION", "FORWARD", "REJECT"];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // ================= REJECT =================
    if (action === "REJECT") {
      application.currentStatus = "REJECTED";
      application.rejectionReason = remarks;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "REJECTED",
        fromOffice: "TEHSIL",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: "TEHSIL_CLERK",
        remarks
      });

      return res.json({ message: "Income certificate rejected" });
    }

    // ================= CORRECTION =================
    if (action === "CORRECTION") {
      application.currentStatus = "CORRECTION_REQUIRED";
      application.correctionMessage = remarks;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "CORRECTION_REQUIRED",
        fromOffice: "TEHSIL",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: "TEHSIL_CLERK",
        remarks
      });

      return res.json({ message: "Correction requested from citizen" });
    }

    // ================= FORWARD TO TEHSILDAR =================
    

    application.currentStatus = "UNDER_VERIFICATION";
    application.assignedTo = getTehsildar(application);
    application.lastUpdated = new Date();
    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "FORWARDED",
      fromOffice: "TEHSIL",
      toOffice: "TEHSILDAR",
      actionBy: req.user._id,
      role: "TEHSIL_CLERK",
      remarks: remarks || "Income verified by Tehsil Clerk"
    });

    res.json({ message: "Forwarded to Tehsildar successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const tehsilClerkVerifyCaste = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (req.user.role !== "TEHSIL_CLERK") {
      return res.status(403).json({ message: "Only Tehsil Clerk allowed" });
    }

    const application = await Application.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.certificateType !== "CASTE" ||
      application.currentOfficeLevel !== "TEHSIL"
    ) {
      return res.status(400).json({
        message: "Application not eligible for caste verification"
      });
    }

    //  Assignment check
    if (
      application.assignedTo &&
      application.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Application not assigned to you" });
    }

    const allowedActions = ["FORWARD", "REJECT", "CORRECTION"];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    //  REJECT
    if (action === "REJECT") {
      application.currentStatus = "REJECTED";
      application.rejectionReason = remarks;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "REJECTED",
        fromOffice: "TEHSIL_CLERK",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Caste certificate rejected" });
    }

    // CORRECTION (Citizen)
    if (action === "CORRECTION") {
      application.currentStatus = "CORRECTION_REQUIRED";
      application.correctionMessage = remarks;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "CORRECTION_REQUIRED",
        fromOffice: "TEHSIL_CLERK",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Correction requested from citizen" });
    }

    //  FORWARD to Tehsildar
    application.currentStatus = "UNDER_VERIFICATION";
    application.assignedTo = (await getTehsildar(application))._id;
    application.lastUpdated = new Date();
    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "FORWARDED",
      fromOffice: "TEHSIL_CLERK",
      toOffice: "TEHSILDAR",
      actionBy: req.user._id,
      role: req.user.role,
      remarks: remarks || "Caste verified by clerk"
    });

    res.json({ message: "Forwarded to Tehsildar for approval" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



