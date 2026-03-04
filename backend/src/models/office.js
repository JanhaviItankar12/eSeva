import mongoose from "mongoose";


const officeSchema = new mongoose.Schema({
  officeName: { 
    type: String, 
    required: true,
    trim: true 
  },

  officeLevel: {
    type: String,
    enum: ["DISTRICT", "TEHSIL", "GRAM"],
    required: true
  },

  parentOffice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    default: null,
    validate: {
      validator: async function(value) {
        if (!value) return true;
        
        // Validate hierarchy when saving
        const parent = await mongoose.model('Office').findById(value);
        if (!parent) return false;
        
        if (this.officeLevel === "TEHSIL" && parent.officeLevel !== "DISTRICT") {
          return false;
        }
        
        if (this.officeLevel === "GRAM" && parent.officeLevel !== "TEHSIL") {
          return false;
        }
        
        return true;
      },
      message: 'Invalid parent office for the selected level'
    }
  },

  address: { 
    type: String,
    trim: true 
  },

  pincode: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v.toString());
      },
      message: 'Pincode must be a 6-digit number'
    }
  },

  region: {
    type: String,
    enum: [
      "Central",
      "Northern",
      "Southern",
      "Eastern",
      "Western",
      "North-Eastern"
    ],
    required: function() {
      return this.officeLevel === "DISTRICT";
    }
  },

  isActive: { 
    type: Boolean, 
    default: true 
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate names under same parent
officeSchema.index({ 
  officeName: 1, 
  officeLevel: 1, 
  parentOffice: 1 
}, { 
  unique: true,
  partialFilterExpression: { parentOffice: { $type: "objectId" } }
});

// Virtual for child count
officeSchema.virtual('childCount', {
  ref: 'Office',
  localField: '_id',
  foreignField: 'parentOffice',
  count: true
});



export default mongoose.model("Office", officeSchema);
