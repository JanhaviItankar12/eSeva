import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },

  mobile: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"],
    required: [true, "Mobile No. is required"],
  },
  password: {
    type: String, required: true,
    select: false, // password hidden by default
  },
  passwordResetCount: {
  type: Number,
  default: 0
},



  passwordChangedAt: Date,

  passwordSetupToken: {
  type: String,
  select: false
},
passwordSetupExpires: Date,
lastPasswordResetAt: Date,
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


  //  Employee ID (Only for Officials)
  employeeId: {
    type: String,
    unique: true,
    sparse: true, // allows null for citizens
  },


  //only for officer
  mustChangePassword: {
    type: Boolean,
    default: function () {
    return this.role !== "CITIZEN";
  }
  },
 

  //  Only for citizens (forgot password)
  otp: String,
  otpExpires: Date,


  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: function () {
      return this.role !== "CITIZEN" && this.role !== "ADMIN";
    }
  },


  isActive: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false },  // Temporary lock
  lockReason: String,
  lockedAt: Date,
  deactivatedAt: Date,
  loginAttempts: { type: Number, default: 0 },
  lastLogin:Date,

  address: {
    district: { type: String },
    tehsil: { type: String },
    village: {
      type: String
    },
  }
}, { timestamps: true });

// Password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = Date.now() - 1000; // prevent token timing issue
}); 


//officer validation
userSchema.pre("validate", async function () {
  const officerRoles = ["GRAM_SEVAK", "SARPANCH", "TEHSIL_CLERK", "TEHSILDAR", "DISTRICT_CLERK", "COLLECTOR"];

  if (officerRoles.includes(this.role) && !this.employeeId) {
    throw new Error("Employee ID is required for officials");
  }

  if (this.role === "CITIZEN") {
    this.employeeId = undefined;
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
