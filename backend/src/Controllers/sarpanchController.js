import Application from "../models/application.js";
import StatusHistory from "../models/statusHistory.js";

export const sarpanchVerifyApplication = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    //  Role check
    if (req.user.role !== "SARPANCH") {
      return res.status(403).json({
        message: "Only Sarpanch can perform this action"
      });
    }

    //  Fetch application
    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Correct stage validation
    if (
      application.currentOfficeLevel !== "GRAM" ||
      application.currentStatus !== "UNDER_VERIFICATION" ||
      application.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({
        message: "Application not assigned to this Sarpanch"
      });
    }

    // Certificate authority check
    if (application.certificateType !== "RESIDENCE") {
      return res.status(403).json({
        message: "Sarpanch can act only on Residence certificates"
      });
    }

    //  Allowed actions
    const allowedActions = ["APPROVE", "REJECT", "CORRECTION"];
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
        role: "SARPANCH",
        remarks
      });

      return res.json({ message: "Residence certificate rejected" });
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
        role: "SARPANCH",
        remarks
      });

      return res.json({ message: "Correction requested from citizen" });
    }

    // ================= APPROVE (FINAL) =================
    application.currentStatus = "APPROVED";
    application.lastUpdated = new Date();

    await application.save();

    await StatusHistory.create({
      applicationId: application._id,
      action: "APPROVED",
      fromOffice: "GRAM",
      toOffice: "CITIZEN",
      actionBy: req.user._id,
      role: "SARPANCH",
      remarks: "Residence certificate approved"
    });

    res.json({
      message: "Residence certificate approved successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


