import Application from "../models/application.js";
import User from "../models/user.js";

export const getCitizeninfo = async (req, res) => {
    try {

        const  id  = req.user.id;
        
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
    const  id  = req.user.id;
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
    const  id  = req.user.id;
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
    const  id  = req.user.id;   // this is citizenId

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


