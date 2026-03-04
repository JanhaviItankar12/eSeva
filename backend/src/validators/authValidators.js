import { body } from "express-validator";

export const registerCitizenValidator = [
  body("name")
    .notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail().withMessage("Invalid email format"),

  body("mobile")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid Indian mobile number"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain number")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain special character")
];


export const registerOfficerValidator = [

  // ==========================
  // Name
  // ==========================
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  // ==========================
  // Email
  // ==========================
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  // ==========================
  // Mobile (Indian)
  // ==========================
  body("mobile")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid Indian mobile number"),

  // ==========================
  // Role
  // ==========================
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([
     
      "GRAM_SEVAK",
      "SARPANCH",
      "TEHSIL_CLERK",
      "TEHSILDAR",
      "DISTRICT_CLERK",
      "COLLECTOR",
     
    ])
    .withMessage("Invalid role"),

  // ==========================
  // Employee ID (Required for officers)
  // ==========================
  body("employeeId")
    .if(body("role").not().isIn(["CITIZEN", "ADMIN"]))
    .notEmpty()
    .withMessage("Employee ID is required for officers"),

  // ==========================
  // Office (Required for officers)
  // ==========================
  body("office")
    .if(body("role").not().isIn(["CITIZEN", "ADMIN"]))
    .notEmpty()
    .withMessage("Office selection is required"),

];




