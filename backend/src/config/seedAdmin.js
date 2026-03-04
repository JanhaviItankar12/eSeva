import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const existingAdmin = await User.findOne({ role: "ADMIN" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

 

  await User.create({
    name: "Super Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "ADMIN"
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();
