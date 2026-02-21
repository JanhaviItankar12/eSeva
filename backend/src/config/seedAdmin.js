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

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: "Super Admin",
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "ADMIN"
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();
