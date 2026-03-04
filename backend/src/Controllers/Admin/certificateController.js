import Application from "../../models/application.js";
import Certificate from "../../models/certificate.js";



export const getDocumentTypes = async (req, res) => {
  try {
    const { type, processingLevel, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (processingLevel && processingLevel !== 'all') {
      filter.processingLevel = processingLevel;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count
    const total = await Certificate.countDocuments(filter);
    
    // Get document types with application counts
    const documentTypes = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get application counts for each document type
    const documentTypesWithCounts = await Promise.all(
      documentTypes.map(async (doc) => {
        const totalApplications = await Application.countDocuments({
          documentType: doc._id
        });
        
        return {
          ...doc,
          totalApplications
        };
      })
    );

    res.json({
      success: true,
      data: documentTypesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get document types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document types',
      error: error.message
    });
  }
};


export const getDocumentTypeById = async (req, res) => {
  try {
    const documentType = await Certificate.findById(req.params.id).lean();
    
    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    // Get application count
    const totalApplications = await Application.countDocuments({
      documentType: documentType._id
    });

    res.json({
      success: true,
      data: {
        ...documentType,
        totalApplications
      }
    });
  } catch (error) {
    console.error('Get document type by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document type',
      error: error.message
    });
  }
};

export const createDocumentType = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      hierarchy,
      processingLevel,
      slaDays,
      fee,
      feeType,
      isActive,
      requiredDocs,
      rejectionReasons,
      validFor,
      authority,
      maxFileSize,
      allowedFormats
    } = req.body;

    // Check if document type with same name or type already exists
    const existingType = await Certificate.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { type: { $regex: new RegExp(`^${type}$`, 'i') } }
      ]
    });

    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Document type with this name or code already exists',
        field: existingType.name.toLowerCase() === name.toLowerCase() ? 'name' : 'type'
      });
    }

    // Validate hierarchy
    if (!hierarchy || hierarchy.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one processing level is required',
        field: 'hierarchy'
      });
    }

    // Check if each level has at least one officer
    for (let i = 0; i < hierarchy.length; i++) {
      if (hierarchy[i].officers.length === 0) {
        return res.status(400).json({
          success: false,
          message: `At least one officer must be assigned at ${hierarchy[i].level} level`,
          field: `hierarchy_${i}`
        });
      }
    }

    // Create new document type
    const documentType = await Certificate.create({
      name,
      type: type.toUpperCase(),
      description,
      hierarchy,
      processingLevel,
      slaDays,
      fee,
      feeType,
      isActive: isActive !== undefined ? isActive : true,
      requiredDocs: requiredDocs || [],
      rejectionReasons: rejectionReasons || ['Incomplete Information', 'Invalid Documents'],
      validFor,
      authority,
      maxFileSize: maxFileSize || 5,
      allowedFormats: allowedFormats || ['PDF', 'JPG', 'PNG'],
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Document type created successfully',
      data: documentType
    });
  } catch (error) {
    console.error('Create document type error:', error);
    
    // Handle duplicate key error
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
      message: 'Failed to create document type',
      error: error.message
    });
  }
};


export const updateDocumentType = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      hierarchy,
      processingLevel,
      slaDays,
      fee,
      feeType,
      isActive,
      requiredDocs,
      rejectionReasons,
      validFor,
      authority,
      maxFileSize,
      allowedFormats
    } = req.body;

    let documentType = await Certificate.findById(req.params.id);

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    // Check if updating to existing name/type (excluding current document)
    if (name || type) {
      const existingType = await Certificate.findOne({
        _id: { $ne: req.params.id },
        $or: []
      });

      if (name) {
        existingType.$or.push({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      }
      if (type) {
        existingType.$or.push({ type: { $regex: new RegExp(`^${type}$`, 'i') } });
      }

      if (existingType && existingType.$or.length > 0) {
        const conflict = await Certificate.findOne(existingType);
        if (conflict) {
          return res.status(400).json({
            success: false,
            message: 'Document type with this name or code already exists',
            field: conflict.name.toLowerCase() === name?.toLowerCase() ? 'name' : 'type'
          });
        }
      }
    }

    // Validate hierarchy if provided
    if (hierarchy) {
      if (hierarchy.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one processing level is required',
          field: 'hierarchy'
        });
      }

      for (let i = 0; i < hierarchy.length; i++) {
        if (hierarchy[i].officers.length === 0) {
          return res.status(400).json({
            success: false,
            message: `At least one officer must be assigned at ${hierarchy[i].level} level`,
            field: `hierarchy_${i}`
          });
        }
      }
    }

    // Update fields
    documentType = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        name: name || documentType.name,
        type: type ? type.toUpperCase() : documentType.type,
        description: description || documentType.description,
        hierarchy: hierarchy || documentType.hierarchy,
        processingLevel: processingLevel || documentType.processingLevel,
        slaDays: slaDays || documentType.slaDays,
        fee: fee !== undefined ? fee : documentType.fee,
        feeType: feeType || documentType.feeType,
        isActive: isActive !== undefined ? isActive : documentType.isActive,
        requiredDocs: requiredDocs || documentType.requiredDocs,
        rejectionReasons: rejectionReasons || documentType.rejectionReasons,
        validFor: validFor || documentType.validFor,
        authority: authority || documentType.authority,
        maxFileSize: maxFileSize || documentType.maxFileSize,
        allowedFormats: allowedFormats || documentType.allowedFormats,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Document type updated successfully',
      data: documentType
    });
  } catch (error) {
    console.error('Update document type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update document type',
      error: error.message
    });
  }
};


export const deleteDocumentType = async (req, res) => {
  try {
    const documentType = await Certificate.findById(req.params.id);

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    // Check if document type has any applications
    const applicationsCount = await Application.countDocuments({
      documentType: documentType._id
    });

    if (applicationsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete document type with existing applications. Deactivate it instead.'
      });
    }

    await documentType.deleteOne();

    res.json({
      success: true,
      message: 'Document type deleted successfully'
    });
  } catch (error) {
    console.error('Delete document type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document type',
      error: error.message
    });
  }
};


export const duplicateDocumentType = async (req, res) => {
  try {
    const originalType = await Certificate.findById(req.params.id);

    if (!originalType) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    // Create new name and type
    const newName = `${originalType.name} (Copy)`;
    const newType = `${originalData.type}_COPY`;

    // Check if copy already exists
    const existingCopy = await Certificate.findOne({
      $or: [
        { name: newName },
        { type: newType }
      ]
    });

    if (existingCopy) {
      // If copy exists, add number suffix
      let counter = 1;
      let finalName = newName;
      let finalType = newType;
      
      while (await Certificate.findOne({ 
        $or: [
          { name: finalName },
          { type: finalType }
        ]
      })) {
        counter++;
        finalName = `${originalType.name} (Copy ${counter})`;
        finalType = `${originalData.type}_COPY${counter}`;
      }
      
      newName = finalName;
      newType = finalType;
    }

    // Create duplicate
    const duplicateData = originalType.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.__v;

    const duplicate = await Certificate.create({
      ...duplicateData,
      name: newName,
      type: newType,
      isActive: false, // Deactivate by default
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Document type duplicated successfully',
      data: duplicate
    });
  } catch (error) {
    console.error('Duplicate document type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate document type',
      error: error.message
    });
  }
};


export const toggleDocumentTypeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const documentType = await Certificate.findById(req.params.id);

    if (!documentType) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    documentType.isActive = isActive;
    documentType.updatedBy = req.user.id;
    await documentType.save();

    res.json({
      success: true,
      message: `Document type ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: documentType
    });
  } catch (error) {
    console.error('Toggle document type status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle document type status',
      error: error.message
    });
  }
};


export const getDocumentTypeStats = async (req, res) => {
  try {
    const totalTypes = await Certificate.countDocuments();
    const activeTypes = await Certificate.countDocuments({ isActive: true });
    const inactiveTypes = await Certificate.countDocuments({ isActive: false });

    // Get counts by processing level
    const byLevel = await Certificate.aggregate([
      {
        $group: {
          _id: '$processingLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get application counts per type
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$documentType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: totalTypes,
        active: activeTypes,
        inactive: inactiveTypes,
        byLevel: byLevel.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalApplications: applicationStats.reduce((sum, item) => sum + item.count, 0)
      }
    });
  } catch (error) {
    console.error('Get document type stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document type statistics',
      error: error.message
    });
  }
};




