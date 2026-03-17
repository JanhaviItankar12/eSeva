import Certificate from "../../models/certificate.js";
import Application from "../../models/application.js";


// 🔹 Create Certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      authority,
      validFor,
      processingLevel,
      hierarchy,
      slaDays,
      fee,
      feeType,
      requiredDocs,
      rejectionReasons,
      isActive
    } = req.body;

    // Basic required validation
    if (
      !name ||
      !type ||
      !description ||
      !authority ||
      !validFor ||
      !processingLevel ||
      !slaDays ||
      fee === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check duplicate type
    const existing = await Certificate.findOne({ type });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Certificate type already exists"
      });
    }

    const certificate = await Certificate.create({
      name,
      type,
      description,
      authority,
      validFor,
      processingLevel,
      hierarchy,
      slaDays,
      fee,
      feeType,
      requiredDocs,
      rejectionReasons,
      isActive
    });

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: certificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create certificate",
      error: error.message
    });
  }
};


// 🔹 Update Certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
  
    
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    // If type is being updated, check duplicate
    if (req.body.type && req.body.type !== certificate.type) {
      const existing = await Certificate.findOne({ type: req.body.type });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Certificate type already exists"
        });
      }
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      req.body.formData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Certificate updated successfully",
      data: updatedCertificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message
    });
  }
};

export const toggleCertificateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    if(certificate.isActive){
      const applicationExists=await Application.exists({
        certificate:id
      });

      if(applicationExists){
         return res.status(400).json({
          success: false,
          message:
            "Cannot deactivate certificate. Applications already exist."
        });
      }
    }

     // Toggle status
    certificate.isActive = !certificate.isActive;
    await certificate.save();


    res.json({
      success: true,
      message: `Certificate ${
        certificate.isActive ? "activated" : "deactivated"
      } successfully`,
      data: certificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
      error: error.message
    });
  }
};

//all certicates
export const allCertificate=async(req,res)=>{
  try {
    
    const certificateData=await Certificate.find();
    if(certificateData.length==0){
      return res.status(404).json({
        message:"Certicates not Found!"
      })
    }

   

    return res.status(200).json({
      message:"Certicates Data fetched...",
      certicateCount:certificateData.length,
      certificateData
    })
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message:"Server Error"
    })
  }
}

//certificate data
export const certificateById=async(req,res)=>{
  try {

    const {id}=req.params;

    const certificateData=await Certificate.findById(id);

    if(!certificateData){
      return res.status(404).json({
      message:"Certificate not found"
    })
    }

    return res.status(200).json({
      message:"Certificate Data fetched Successfully!",
      certificateData
    })
    
  } catch (error) {
     console.log(error.message);
    return res.status(500).json({
      message:"Server Error"
    })
  }
}




