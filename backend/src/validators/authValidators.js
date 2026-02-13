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

