import User from "../../models/user.js";
import crypto from "crypto";
import { sendCitizenLockedEmail, sendCitizenUnlockedEmail, sendOfficeDeactivatedEmail, sendOfficerActivatedEmail, sendOfficerLockedEmail, sendOfficerUnlockedEmail, sendTemporaryPasswordEmail, sendTemporaryPasswordResetEmail } from "../../service/sendEmail.js";
import Office from "../../models/office.js";


export const createOfficer = async (req, res) => {
  try {
    const { name, email, mobile, role, employeeId, office } = req.body;

    if (!name || !email || !mobile || !role) {
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
      mustChangePassword: role != "CITIZEN",
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
      .populate({
        path: "office",
        select: "officeName officeLevel" // sirf required fields
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

export const getAllCitizen = async (req, res) => {
  try {
    
    const citizenData = await User.find({ role: "CITIZEN" }).select("-isFirstLogin -loginAttempts -mustChangePassword -passwordResetCount");

    // Check if any citizens exist
    if (citizenData.length === 0) {
      return res.status(404).json({
        message: "No Citizen Found"
      });
    }

    return res.status(200).json({
      message: "Citizen Data fetched successfully",
      citizenData
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const updateOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobile,
      role,
      employeeId,
      office
    } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check email uniqueness if changed
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          field: "email",
          message: "Email already in use"
        });
      }
    }

    // Check mobile uniqueness if changed
    if (mobile && mobile !== user.mobile) {
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          field: "mobile",
          message: "Mobile number already in use"
        });
      }
    }

    // Check employeeId uniqueness if changed
    if (employeeId && employeeId !== user.employeeId) {
      const existingEmpId = await User.findOne({ employeeId });
      if (existingEmpId) {
        return res.status(400).json({
          success: false,
          field: "employeeId",
          message: "Employee ID already exists"
        });
      }
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.role = role || user.role;
    user.employeeId = employeeId || user.employeeId;
    user.office = office || user.office;

    await user.save();

    const updatedUser = await User.findById(id)
      .select("-password -otp -passwordSetupToken")
      .populate({
        path: "office",
        select: "officeName officeLevel region"
      });

    res.json({
      success: true,
      message: "Officer updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const lockOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot lock admin accounts"
      });
    }

    user.isLocked = true;
    user.lockReason = reason || "Locked by administrator";
    user.lockedAt = Date.now();
    await user.save();

    // Send notification email
    await sendOfficerLockedEmail({
      toEmail: user.email,
      toName: user.name,
      reason: reason
    })

    res.json({
      success: true,
      message: "Officer locked successfully",
      data: { isLocked: true, lockReason: reason, lockedAt: user.lockedAt }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const unlockOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isLocked = false;
    user.lockReason = undefined;
    user.lockedAt = undefined;
    user.loginAttempts = 0;
    await user.save();

    // Send notification email
    await sendOfficerUnlockedEmail({
      toEmail: user.email,
      toName: user.name
    })

    res.json({
      success: true,
      message: "Officer unlocked successfully",
      data: { isLocked: false }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deactivateOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("office", "officeName");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot deactivate admin accounts"
      });
    }

    user.isActive = false;
    user.deactivatedAt = Date.now();
    await user.save();

    // Send notification email
    await sendOfficeDeactivatedEmail({
      toEmail: user.email,
      toName: user.name,
      role: user.role,
      officeName: user.office?.officeName
    })

    res.json({
      success: true,
      message: "Officer deactivated successfully",
      data: { isActive: false, deactivatedAt: user.deactivatedAt }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const activateOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("office", "officeName");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = true;
    user.deactivatedAt = undefined;
    await user.save();

    // Send notification email
    await sendOfficerActivatedEmail({
      toEmail: user.email,
      toName: user.name,
      role: user.role,
      officeName: user.office?.officeName
    })

    res.json({
      success: true,
      message: "Officer activated successfully",
      data: { isActive: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex");

    // Create setup token
    const passwordSetupToken = crypto.randomBytes(32).toString("hex");
    const passwordSetupExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.password = tempPassword;
    user.passwordSetupToken = passwordSetupToken;
    user.passwordSetupExpires = passwordSetupExpires;
    user.mustChangePassword = true;
    user.passwordResetCount = (user.passwordResetCount || 0) + 1;
    user.lastPasswordResetAt = Date.now();

    // Unlock if locked
    if (user.isLocked) {
      user.isLocked = false;
      user.lockReason = undefined;
      user.lockedAt = undefined;
      user.loginAttempts = 0;
    }

    await user.save();



    await sendTemporaryPasswordResetEmail({
      toEmail: user.email,
      toName: user.name,
      tempPassword: tempPassword
    })

    res.json({
      success: true,
      message: "Password reset successfully. Temporary password sent to email."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getExpiredPasswordUsers = async (req, res) => {
  try {
    // 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find users (non-citizens) whose temporary password is still not changed after 24 hours
    const expiredUsers = await User.find({
      role: { $ne: "CITIZEN" }, // exclude citizens
      mustChangePassword: true, // temp password still active
      passwordSetupExpires: { $lt: Date.now() }, // temp password expired
    })
      .select("name email role office employeeId passwordSetupExpires mustChangePassword")
      .populate("office", "officeName");

    res.json({
      success: true,
      count: expiredUsers.length,
      data: expiredUsers,
    });
  } catch (error) {
    console.error("Error fetching expired password users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lock a citizen account
export const lockCitizen = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const citizen = await User.findById(id);
    if (!citizen || citizen.role !== "CITIZEN") {
      return res.status(404).json({ message: "Citizen not found" });
    }

    citizen.isLocked = true; // assuming you have an isLocked field
    citizen.lockReason = reason || "No reason provided";
    citizen.lockedAt = new Date();

    await citizen.save();

    await sendCitizenLockedEmail({
      toEmail:citizen.email, toName:citizen.name, reason:reason
    })

    return res.status(200).json({
      message: "Citizen account locked successfully",
      citizen
    });
  } catch (error) {
    console.error("Lock Citizen Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Unlock a citizen account
export const unlockCitizen = async (req, res) => {
  try {
    const { id } = req.params;

    const citizen = await User.findById(id);
    if (!citizen || citizen.role !== "CITIZEN") {
      return res.status(404).json({ message: "Citizen not found" });
    }

    citizen.isLocked = false;
    citizen.lockReason = null;
    citizen.lockedAt = null;

    await citizen.save();

    await sendCitizenUnlockedEmail({
      toEmail:citizen.email,
      toName:citizen.name
    })

    return res.status(200).json({
      message: "Citizen account unlocked successfully",
      citizen
    });
  } catch (error) {
    console.error("Unlock Citizen Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};



