import Office from "../../models/office.js";
import User from "../../models/user.js";
import { sendOfficeDeactivatedEmail } from "../../service/sendEmail.js";



export const createOffice = async (req, res) => {
    try {
        const {
            officeName,
            officeLevel,
            parentOffice,
            address,
            pincode,
            region,
            isActive
        } = req.body;

        // Validation
        if (!officeName || !officeLevel || !pincode) {
            return res.status(400).json({
                success: false,
                message: "Office name, level and pincode are required"
            });
        }

        // Validate office level
        if (!["DISTRICT", "TEHSIL", "GRAM"].includes(officeLevel)) {
            return res.status(400).json({
                success: false,
                message: "Invalid office level. Must be DISTRICT, TEHSIL, or GRAM"
            });
        }

        // Validate region for DISTRICT level
        if (officeLevel === "DISTRICT" && !region) {
            return res.status(400).json({
                success: false,
                message: "Region is required for district"
            });
        }

        // Validate parent office for TEHSIL and GRAM
        if (officeLevel === "TEHSIL" && !parentOffice) {
            return res.status(400).json({
                success: false,
                message: "Parent district is required for tehsil"
            });
        }

        if (officeLevel === "GRAM" && !parentOffice) {
            return res.status(400).json({
                success: false,
                message: "Parent tehsil is required for gram panchayat"
            });
        }


        // Check if parent office exists and is valid
        let finalRegion = null;

        if (parentOffice) {
            const parent = await Office.findById(parentOffice);

            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: "Parent office not found"
                });
            }

            // Validate hierarchy
            if (officeLevel === "TEHSIL" && parent.officeLevel !== "DISTRICT") {
                return res.status(400).json({
                    success: false,
                    message: "Tehsil must be under a district"
                });
            }

            if (officeLevel === "GRAM" && parent.officeLevel !== "TEHSIL") {
                return res.status(400).json({
                    success: false,
                    message: "Gram Panchayat must be under a tehsil"
                });
            }

            //  AUTO ASSIGN REGION FROM PARENT
            if (officeLevel === "TEHSIL") {
                finalRegion = parent.region; // district ka region
            }

            if (officeLevel === "GRAM") {
                // need district region via tehsil
                const district = await Office.findById(parent.parentOffice);
                finalRegion = district?.region || null;
            }
        }

        // Check for duplicate office name within same parent/level
        const existingOffice = await Office.findOne({
            officeName: { $regex: new RegExp(`^${officeName}$`, 'i') },
            officeLevel,
            parentOffice: parentOffice || null
        });

        if (existingOffice) {
            return res.status(400).json({
                success: false,
                message: `An ${officeLevel.toLowerCase()} with this name already exists ${parentOffice ? 'in this parent office' : ''}`,
                field: "officeName"
            });
        }

        // Create office
        const office = await Office.create({
            officeName,
            officeLevel,
            parentOffice: parentOffice || null,
            address,
            pincode,
            region:
                officeLevel === "DISTRICT"
                    ? region
                    : finalRegion,
            isActive: isActive !== undefined ? isActive : true
        });

        // Populate parent office details
        await office.populate('parentOffice', 'officeName officeLevel');

        res.status(201).json({
            success: true,
            message: `${officeLevel.toLowerCase()} created successfully`,
            data: office
        });

    } catch (error) {
        console.error("Create Office Error:", error);

        // Handle duplicate key error (if any unique indexes)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`,
                field
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create office",
            error: error.message
        });
    }
};


export const updateOffice = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find office
        const office = await Office.findById(id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found"
            });
        }

        // Prevent changing office level
        if (updates.officeLevel && updates.officeLevel !== office.officeLevel) {
            return res.status(400).json({
                success: false,
                message: "Office level cannot be changed"
            });
        }

        // Validate region for DISTRICT
        if (office.officeLevel === "DISTRICT" && updates.region === "") {
            return res.status(400).json({
                success: false,
                message: "Region cannot be empty for district"
            });
        }

        // Check if trying to change parent office
        if (updates.parentOffice && updates.parentOffice !== office.parentOffice?.toString()) {
            // Validate new parent office
            const newParent = await Office.findById(updates.parentOffice);

            if (!newParent) {
                return res.status(404).json({
                    success: false,
                    message: "Parent office not found"
                });
            }

            // Validate hierarchy with new parent
            if (office.officeLevel === "TEHSIL" && newParent.officeLevel !== "DISTRICT") {
                return res.status(400).json({
                    success: false,
                    message: "Tehsil must be under a district"
                });
            }

            if (office.officeLevel === "GRAM" && newParent.officeLevel !== "TEHSIL") {
                return res.status(400).json({
                    success: false,
                    message: "Gram Panchayat must be under a tehsil"
                });
            }

            // Check if office has children before moving
            if (office.officeLevel === "DISTRICT") {
                const hasTehsils = await Office.exists({ parentOffice: id });
                if (hasTehsils) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot move district that has tehsils"
                    });
                }
            }

            if (office.officeLevel === "TEHSIL") {
                const hasGramPanchayats = await Office.exists({ parentOffice: id });
                if (hasGramPanchayats) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot move tehsil that has gram panchayats"
                    });
                }
            }
        }

        // Check for duplicate name (excluding current office)
        if (updates.officeName && updates.officeName !== office.officeName) {
            const duplicateName = await Office.findOne({
                officeName: { $regex: new RegExp(`^${updates.officeName}$`, 'i') },
                officeLevel: office.officeLevel,
                parentOffice: updates.parentOffice || office.parentOffice,
                _id: { $ne: id }
            });

            if (duplicateName) {
                return res.status(400).json({
                    success: false,
                    message: `An ${office.officeLevel.toLowerCase()} with this name already exists`,
                    field: "officeName"
                });
            }
        }

        // Update office
        const updatedOffice = await Office.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true }
        ).populate('parentOffice', 'officeName officeLevel');

        res.json({
            success: true,
            message: `${office.officeLevel.toLowerCase()} updated successfully`,
            data: updatedOffice
        });

    } catch (error) {
        console.error("Update Office Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update office",
            error: error.message
        });
    }
};


export const deActivateOffice = async (req, res) => {
    try {
        const { id } = req.params;

        const office = await Office.findById(id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found"
            });
        }

        // Already inactive check
        if (!office.isActive) {
            return res.status(400).json({
                success: false,
                message: `${office} already inactive`
            });
        }

        // Check child offices (optional business rule)
        const activeChildren = await Office.exists({
            parentOffice: id,
            isActive: true
        });

        if (activeChildren) {
            return res.status(400).json({
                success: false,
                message: `Deactivate child offices first`
            });
        }

        //  Deactivate instead of delete
        office.isActive = false;
        await office.save();

        // Find linked users
        const linkedUsers = await User.find({ office: id });
        await Promise.all(
            linkedUsers.map(user =>
                sendOfficeDeactivatedEmail({
                    toEmail: user.email,
                    toName: user.name,
                    officeName: office.officeName,
                    officeLevel: office.officeLevel
                })
            )
        );

        res.json({
            success: true,
            message: `${office.officeLevel} deactivated successfully`
        });

    } catch (error) {
        console.error("Deactivate Office Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to deactivate office"
        });
    }
};


export const getOffices = async (req, res) => {
    try {
        const { level, parentOffice, region, isActive } = req.query;

        // Build filter object
        const filter = {};

        if (level) {
            filter.officeLevel = level;
        }

        if (parentOffice) {
            filter.parentOffice = parentOffice;
        }

        if (region) {
            filter.region = region;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        // Get offices
        const offices = await Office.find(filter)
            .populate('parentOffice', 'officeName officeLevel')
            .sort({ officeName: 1 });

        res.json({
            success: true,
            count: offices.length,
            data: offices
        });

    } catch (error) {
        console.error("Get Offices Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch offices",
            error: error.message
        });
    }
};


export const getDistricts = async (req, res) => {
  try {
    const districts = await Office.aggregate([
      {
        $match: {
          officeLevel: "DISTRICT"
        }
      },
      {
        $lookup: {
          from: "offices", // collection name (lowercase plural usually)
          localField: "_id",
          foreignField: "parentOffice",
          as: "tehsils"
        }
      },
      {
        $addFields: {
          tehsilCount: {
            $size: {
              $filter: {
                input: "$tehsils",
                as: "tehsil",
                cond: { $eq: ["$$tehsil.officeLevel", "TEHSIL"] }
              }
            }
          }
        }
      },
      {
        $project: {
          officeName: 1,
          region: 1,
          pincode: 1,
          address: 1,
          isActive: 1,
          tehsilCount: 1
        }
      },
      {
        $sort: { officeName: 1 }
      }
    ]);

    res.json({
      success: true,
      count: districts.length,
      data: districts
    });

  } catch (error) {
    console.error("Get Districts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch districts",
      error: error.message
    });
  }
};


export const getTehsilsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    // Verify district exists
    const district = await Office.findOne({
      _id: districtId,
      officeLevel: "DISTRICT"
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found"
      });
    }

    const tehsils = await Office.aggregate([
      {
        $match: {
          officeLevel: "TEHSIL",
          parentOffice: district._id
        }
      },
      {
        $lookup: {
          from: "offices",
          let: { tehsilId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentOffice", "$$tehsilId"] },
                    { $eq: ["$officeLevel", "GRAM"] }
                  ]
                }
              }
            }
          ],
          as: "grams"
        }
      },
      {
        $addFields: {
          gramCount: { $size: "$grams" }
        }
      },
      {
        $project: {
          officeName: 1,
          pincode: 1,
          address: 1,
          isActive: 1,
          gramCount: 1
        }
      },
      {
        $sort: { officeName: 1 }
      }
    ]);

    res.json({
      success: true,
      count: tehsils.length,
      data: tehsils
    });

  } catch (error) {
    console.error("Get Tehsils Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tehsils",
      error: error.message
    });
  }
};


export const getGramPanchayatsByTehsil = async (req, res) => {
    try {
        const { tehsilId } = req.params;

        // Verify tehsil exists
        const tehsil = await Office.findOne({
            _id: tehsilId,
            officeLevel: "TEHSIL"
        });

        if (!tehsil) {
            return res.status(404).json({
                success: false,
                message: "Tehsil not found"
            });
        }

        const gramPanchayats = await Office.find({
            officeLevel: "GRAM",
            parentOffice: tehsilId,
            
        })
            .select('officeName pincode address isActive')
            .sort({ officeName: 1 });

        res.json({
            success: true,
            count: gramPanchayats.length,
            data: gramPanchayats
        });

    } catch (error) {
        console.error("Get Gram Panchayats Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch gram panchayats",
            error: error.message
        });
    }
};


export const getOfficeById = async (req, res) => {
    try {
        const { id } = req.params;

        const office = await Office.findById(id)
            .populate('parentOffice', 'officeName officeLevel');

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found"
            });
        }

        // Get children if any
        let children = [];
        if (office.officeLevel === "DISTRICT") {
            children = await Office.find({
                parentOffice: id,
                officeLevel: "TEHSIL"
            }).select('officeName isActive');
        } else if (office.officeLevel === "TEHSIL") {
            children = await Office.find({
                parentOffice: id,
                officeLevel: "GRAM"
            }).select('officeName isActive');
        }

        res.json({
            success: true,
            data: {
                ...office.toObject(),
                children
            }
        });

    } catch (error) {
        console.error("Get Office By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch office",
            error: error.message
        });
    }
};


export const activateOffice = async (req, res) => {
    try {
        const { id } = req.params;

        const office = await Office.findById(id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found"
            });
        }

        // Already active check
        if (office.isActive) {
            return res.status(400).json({
                success: false,
                message: "Office is already active"
            });
        }

        //  IMPORTANT: Check parent office
        if (office.parentOffice) {
            const parent = await Office.findById(office.parentOffice);

            if (parent && !parent.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot activate office because parent office is inactive"
                });
            }
        }

        // Activate office
        office.isActive = true;
        await office.save();

        res.json({
            success: true,
            message: `${office.officeLevel.toLowerCase()} activated successfully`,
            data: office
        });

    } catch (error) {
        console.error("Activate Office Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to activate office",
            error: error.message
        });
    }
};


export const getActiveDistricts = async (req, res) => {
  try {
    const districts = await Office.aggregate([
      {
        $match: {
          officeLevel: "DISTRICT",
          isActive: true
        }
      },
      {
        $lookup: {
          from: "offices", // collection name (lowercase plural usually)
          localField: "_id",
          foreignField: "parentOffice",
          as: "tehsils"
        }
      },
      {
        $addFields: {
          tehsilCount: {
            $size: {
              $filter: {
                input: "$tehsils",
                as: "tehsil",
                cond:  {
                  $and: [
                    { $eq: ["$$tehsil.officeLevel", "TEHSIL"] },
                    { $eq: ["$$tehsil.isActive", true] }  //  Only active tehsils count
                  ]
                } 
              }
            }
          }
        }
      },
      {
        $project: {
          officeName: 1,
          region: 1,
          pincode: 1,
          address: 1,
          isActive: 1,
          tehsilCount: 1
        }
      },
      {
        $sort: { officeName: 1 }
      }
    ]);

    res.json({
      success: true,
      count: districts.length,
      data: districts
    });

  } catch (error) {
    console.error("Get Districts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch districts",
      error: error.message
    });
  }
};

export const getActiveTehsilsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    const district = await Office.findOne({
      _id: districtId,
      officeLevel: "DISTRICT",
      isActive: true   //  district must be active
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found or inactive"
      });
    }

    const tehsils = await Office.aggregate([
      {
        $match: {
          officeLevel: "TEHSIL",
          parentOffice: district._id,
          isActive: true   //  only active tehsils
        }
      },
      {
        $lookup: {
          from: "offices",
          let: { tehsilId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentOffice", "$$tehsilId"] },
                    { $eq: ["$officeLevel", "GRAM"] },
                    { $eq: ["$isActive", true] }   //  only active grams
                  ]
                }
              }
            }
          ],
          as: "grams"
        }
      },
      {
        $addFields: {
          gramCount: { $size: "$grams" }
        }
      },
      {
        $project: {
          officeName: 1,
          pincode: 1,
          address: 1,
          gramCount: 1
        }
      },
      { $sort: { officeName: 1 } }
    ]);

    res.json({
      success: true,
      count: tehsils.length,
      data: tehsils
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tehsils",
      error: error.message
    });
  }
};

export const getActiveGramPanchayatsByTehsil = async (req, res) => {
  try {
    const { tehsilId } = req.params;

    const tehsil = await Office.findOne({
      _id: tehsilId,
      officeLevel: "TEHSIL",
      isActive: true   // tehsil must be active
    });

    if (!tehsil) {
      return res.status(404).json({
        success: false,
        message: "Tehsil not found or inactive"
      });
    }

    const gramPanchayats = await Office.find({
      officeLevel: "GRAM",
      parentOffice: tehsilId,
      isActive: true   // only active grams
    })
      .select("officeName pincode address")
      .sort({ officeName: 1 });

    res.json({
      success: true,
      count: gramPanchayats.length,
      data: gramPanchayats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gram panchayats",
      error: error.message
    });
  }
};

export const getOfficerRoles=async(req,res)=>{
  try {
    const roles={
      GRAM:[
        {label:"Gram Sevak",value:"GRAM_SEVAK"},
        {label:"Sarpanch",value:"SARPANCH"}
      ],
      TEHSIL:[
        {label:"Tehsil Clerk",value:"TEHSIL_CLERK"},
        {label:"Tehsildar",value:"TEHSILDAR"}
      ],
      DISTRICT:[
        { label: "District Clerk", value: "DISTRICT_CLERK" },
        { label: "Collector", value: "COLLECTOR" }
      ]
    };

     return res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
     res.status(500).json({
      success: false,
      message: "Failed to fetch officer roles"
    });
  }
}






