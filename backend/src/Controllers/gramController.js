import Application from "../models/application.js";
import StatusHistory from "../models/statusHistory.js";
import { getSarpanch } from "./HelperFuction/getSarpanch.js";
import { getTehsilClerk } from "./HelperFuction/getTehsilClerk.js";

export const gramVerifyApplication = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    // Role check
    if (req.user.role !== "GRAM_SEVAK") {
      return res.status(403).json({ message: "Only Gram Sevak allowed" });
    }

    //  Fetch application
    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Block invalid certificates at Gram level
    if (["CASTE", "DOMICILE"].includes(application.certificateType)) {
      return res.status(400).json({
        message: "This certificate does not start at Gram level"
      });
    }

    // Ensure application is at GRAM level
    if (application.currentOfficeLevel !== "GRAM") {
      return res.status(400).json({ message: "Application not at Gram level" });
    }

    //  Allowed actions
    const allowedActions = ["FORWARD", "REJECT", "CORRECTION", "APPROVE"];
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
        fromOffice: "GRAM",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Application rejected" });
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
        fromOffice: "GRAM",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks
      });

      return res.json({ message: "Correction requested from citizen" });
    }

    // ================= APPROVE (ONLY BIRTH) =================
    if (action === "APPROVE") {
      if (application.certificateType !== "BIRTH") {
        return res.status(403).json({
          message: "Only Birth certificate can be approved at Gram level"
        });
      }

      application.currentStatus = "APPROVED";
      application.currentOfficeLevel = "GRAM";
      application.lastUpdated = new Date();

      await application.save();

      await StatusHistory.create({
        applicationId: application._id,
        action: "APPROVED",
        fromOffice: "GRAM",
        toOffice: "CITIZEN",
        actionBy: req.user._id,
        role: req.user.role,
        remarks: "Birth certificate approved"
      });

      return res.json({ message: "Birth certificate approved" });
    }

    // ================= FORWARD =================
    let nextOffice = null;
    let assignedTo = null;

    // Residence → Sarpanch
    if (application.certificateType === "RESIDENCE") {
      nextOffice = "GRAM"; // office remains GRAM
      assignedTo = await getSarpanch(application);
    }

    // Income → Tehsil Clerk
    else if (application.certificateType === "INCOME") {
      nextOffice = "TEHSIL";
      assignedTo = await getTehsilClerk(application);
    }

    if (!assignedTo) {
      return res.status(500).json({ message: "Next authority not found" });
    }

    application.currentStatus = "UNDER_VERIFICATION";
    application.currentOfficeLevel = nextOffice;
    application.assignedTo = assignedTo._id;
    application.lastUpdated = new Date();

    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "FORWARDED",
      fromOffice: "GRAM",
      toOffice: nextOffice,
      actionBy: req.user._id,
      role: req.user.role,
      remarks
    });

    res.json({
      message: "Application forwarded successfully",
      forwardedTo: assignedTo.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


