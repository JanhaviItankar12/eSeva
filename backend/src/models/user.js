import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "CITIZEN",
      "GRAM_SEVAK",
      "SARPANCH",
      "TEHSIL_CLERK",
      "TEHSILDAR",
      "DISTRICT_CLERK",
      "COLLECTOR",
      "ADMIN"
    ],
    required: true
  },

  //only for officer
  isFirstLogin:{
    type:Boolean,
    default:false
  },
  tempPasswordExpires:Date,

  //  Only for citizens (forgot password)
  otp: String,
  otpExpires: Date,


  officeLevel: { type: String, enum: ["GRAM", "TEHSIL", "DISTRICT", "STATE"] },
  officeId: { type: mongoose.Schema.Types.ObjectId, ref: "Office" },
  
    employeeId: { type: String }, // Only for govt employees
    isActive: { type: Boolean, default: true },

    address: {
    district: { type: String},
    tehsil: { type: String},
    village: {
      type: String
    },
  },
    createdAt: { type: Date, default: Date.now }
  });

// Password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
