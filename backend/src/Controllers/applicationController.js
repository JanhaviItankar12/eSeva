import { certificateFlow } from "../config/certificateFlow.js";
import { requiredDocuments } from "../config/requiredDoc.js";
import Application from "../models/application.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


export const applyCertificate = async (req, res) => {
  try {
    const  id  = req.user.id;

    
    // Parse normal fields (FormData sends strings)
    const certificateType = req.body.certificateType;
    const certificateData = JSON.parse(req.body.certificateData);
    const issueUrgency = req.body.issueUrgency;
    const jurisdiction = JSON.parse(req.body.jurisdiction);

    const citizen = req.citizen;

    // Validate required fields
    if (!certificateType) {
      return res.status(400).json({
        success: false,
        message: "Certificate type is required",
      });
    }

    if (!certificateData) {
      return res.status(400).json({
        success: false,
        message: "Certificate data is required",
      });
    }

    if (
      !jurisdiction?.village ||
      !jurisdiction?.tehsil ||
      !jurisdiction?.district
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete jurisdiction (village, tehsil, district) is required",
      });
    }

    const flowConfig = certificateFlow[certificateType];

    if (!flowConfig) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate type",
      });
    }

    const requiredDocs = requiredDocuments[certificateType] || [];

    //  HANDLE FILES
    const uploadedFiles = req.files || [];
    const documentTypes = req.body.documentTypes;

    const documentsData = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "eSeva_documents",
        resource_type: "auto",
      });

      documentsData.push({
        documentType: Array.isArray(documentTypes)
          ? documentTypes[i]
          : documentTypes,
        fileUrl: result.secure_url,
        uploadedBy: id,
        uploadedAt: new Date(),
        isVerified: false,
      });

      // Delete local file
      fs.unlinkSync(file.path);
    }

    // Validate required docs
    const uploadedDocTypes = documentsData.map(
      (doc) => doc.documentType
    );

    const missingDocs = requiredDocs.filter(
      (doc) => !uploadedDocTypes.includes(doc)
    );

    if (missingDocs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required documents",
        missingDocs,
      });
    }

    // Generate Application ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const applicationId = `eSEVA/${year}/${certificateType}/${randomNum}`;

    // Expected completion
    const processingDays = issueUrgency === "urgent" ? 3 : 7;
    const expectedCompletionDate = new Date();
    expectedCompletionDate.setDate(
      expectedCompletionDate.getDate() + processingDays
    );

    // Create application
    const application = new Application({
      applicationId,
      citizenId: id,
      certificateType,
      certificateData,
      currentStatus: "SUBMITTED",
      currentOfficeLevel: flowConfig.startOffice,
      approvalFlow: flowConfig.flow,
      currentApprovalIndex: 0,
      issueUrgency: issueUrgency || "normal",
      jurisdiction,
      documents: documentsData,
      appliedDate: new Date(),
      lastUpdated: new Date(),
      expectedCompletionDate,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        applicationId: application.applicationId,
        certificateType: application.certificateType,
        currentStatus: application.currentStatus,
        appliedDate: application.appliedDate,
        expectedCompletionDate:
          application.expectedCompletionDate,
      },
    });
  } catch (error) {
    console.error("Apply certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};





