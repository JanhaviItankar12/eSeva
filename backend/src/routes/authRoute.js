import express from "express";
import { loginUser, registerCitizen } from "../Controllers/authController.js";
import { loginValidator } from "../validators/loginValidate.js";
import { registerCitizenValidator } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", registerCitizenValidator,registerCitizen);
router.post("/login",loginValidator, loginUser);

export default router;

