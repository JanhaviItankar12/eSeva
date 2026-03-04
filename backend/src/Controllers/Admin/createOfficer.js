import User from "../../models/user.js";
import crypto from "crypto";
import { sendTemporaryPasswordEmail } from "../../service/sendEmail.js";


export const createOfficer = async (req, res) => {
  try {
    const { name, email,mobile, role, employeeId,office } = req.body;
    
    if (!name || !email ||!mobile || !role) {
      return res.status(400).json({
        message: "Name, email,mobile and role are required"
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
        field: "email"
      });
    }

    const existingMobNo = await User.findOne({ mobile });
    if (existingMobNo) {
      return res.status(400).json({
        message: "Mobile Number already exists",
        field: "mobile"
      });
    }

    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({
          message: "Employee ID already exists",
          field: "employeeId"
        });
      }
    }

    const roleOfficeMap = {
      COLLECTOR: "DISTRICT",
      DISTRICT_CLERK: "DISTRICT",
      TEHSILDAR: "TEHSIL",
      TEHSIL_CLERK: "TEHSIL",
      SARPANCH: "GRAM",
      GRAM_SEVAK: "GRAM"
    };

    let selectedOffice = null;

    if (role !== "CITIZEN" && role !== "ADMIN") {
      if (!office) {
        return res.status(400).json({
          message: "Office selection is required"
        });
      }

      selectedOffice = await Office.findById(office);

      if (!selectedOffice) {
        return res.status(400).json({
          message: "Invalid office selected"
        });
      }

      if (roleOfficeMap[role] !== selectedOffice.officeLevel) {
        return res.status(400).json({
          message: "Role does not match selected office level"
        });
      }
    }

    //  Generate temporary password (8-10 chars readable)
    const tempPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);



    const user = await User.create({
      name,
      email,
      mobile,
      role,
      employeeId,
      office: selectedOffice?._id || null,
      password: tempPassword,
      mustChangePassword: role!="CITIZEN",
      isActive: true,
      tempPasswordExpires: Date.now() + 24 * 60 * 60 * 1000,
       passwordChangedAt: new Date()
    });

    //  Send temp password via email
    await sendTemporaryPasswordEmail({
      toEmail: user.email,
      toName: user.name,
      tempPassword
    });

    res.status(201).json({
      message: "Officer created. Temporary password sent."
    });

  } catch (error) {
    console.log("ERROR:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
        field
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};



export const getAllOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      role: { $nin: ["CITIZEN", "ADMIN"] }
    })
      .select("-password -otp -otpExpires -passwordSetupToken -passwordChangedAt -passwordSetupExpires -lastPasswordResetAt -mustChangePassword") // sensitive fields remove
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: officers.length,
      data: officers
    });

  } catch (error) {
    console.error("Get Officers Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch officers"
    });
  }
};

