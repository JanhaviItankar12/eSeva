import Application from "../models/application.js";
import StatusHistory from "../models/statusHistory.js";

export const tehsildarApproveIncome = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (req.user.role !== "TEHSILDAR") {
      return res.status(403).json({ message: "Only Tehsildar allowed" });
    }

    const application = await Application.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.certificateType !== "INCOME" ||
      application.currentOfficeLevel !== "TEHSIL" ||
      application.currentStatus !== "UNDER_VERIFICATION"
    ) {
      return res.status(400).json({
        message: "Application not ready for Tehsildar approval"
      });
    }

    //  Assignment check
    if (
      application.assignedTo &&
      application.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Application not assigned to you" });
    }

    const allowedActions = ["APPROVE", "REJECT", "CORRECTION"];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // REJECT
    if (action === "REJECT") {
      application.currentStatus = "REJECTED";
      application.rejectionReason = remarks;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "REJECTED",
        fromOffice: "TEHSILDAR",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Income certificate rejected" });
    }

    //  CORRECTION → Clerk
    if (action === "CORRECTION") {
      application.currentStatus = "UNDER_VERIFICATION";
      application.currentOfficeLevel = "TEHSIL";
      application.assignedTo = (await getTehsilClerk(application))._id;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "CORRECTION",
        fromOffice: "TEHSILDAR",
        toOffice: "TEHSIL_CLERK",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Sent back to clerk for correction" });
    }

    //  APPROVE
    application.currentStatus = "APPROVED";
    application.lastUpdated = new Date();
    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "APPROVED",
      fromOffice: "TEHSILDAR",
      toOffice: "CITIZEN",
      actionBy: req.user._id,
      role: req.user.role,
      remarks: "Income certificate approved"
    });

    res.json({ message: "Income certificate approved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const tehsildarApproveCaste = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (req.user.role !== "TEHSILDAR") {
      return res.status(403).json({ message: "Only Tehsildar allowed" });
    }

    const application = await Application.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.certificateType !== "CASTE" ||
      application.currentOfficeLevel !== "TEHSIL" ||
      application.currentStatus !== "UNDER_VERIFICATION"
    ) {
      return res.status(400).json({
        message: "Application not ready for caste approval"
      });
    }

    // 🔐 Assignment check
    if (
      application.assignedTo &&
      application.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Application not assigned to you" });
    }

    const allowedActions = ["APPROVE", "REJECT", "CORRECTION"];
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
        fromOffice: "TEHSILDAR",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Caste certificate rejected" });
    }

    // SEND BACK TO CLERK
    if (action === "CORRECTION") {
      application.currentStatus = "UNDER_VERIFICATION";
      application.assignedTo = (await getTehsilClerk(application))._id;
      application.lastUpdated = new Date();
      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "CORRECTION",
        fromOffice: "TEHSILDAR",
        toOffice: "TEHSIL_CLERK",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Sent back to clerk for re-verification" });
    }

    //  APPROVE
    application.currentStatus = "APPROVED";
    application.lastUpdated = new Date();
    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "APPROVED",
      fromOffice: "TEHSILDAR",
      toOffice: "CITIZEN",
      actionBy: req.user._id,
      role: req.user.role,
      remarks: "Caste certificate approved"
    });

    res.json({ message: "Caste certificate approved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





