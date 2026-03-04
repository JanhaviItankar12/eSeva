import express from "express";
import { activateOfficer, createOfficer, deactivateOfficer, getAllCitizen, getAllOfficers, getExpiredPasswordUsers, lockCitizen, lockOfficer, resetPassword, unlockCitizen, unlockOfficer, updateOfficer } from "../Controllers/Admin/createOfficer.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizedRoles.js";
import { registerOfficerValidator } from "../validators/authValidators.js";
import { validateRequest } from "../validators/validateRequest.js";
import { activateOffice, createOffice, deActivateOffice, updateOffice } from "../Controllers/Admin/officeController.js";
import { createSystemDefaultSetting, updateTemplateSetting } from "../Controllers/Admin/globalSettingController.js";

const router=express.Router();

//officer management
router.post('/create-officer',protect,authorizeRoles("ADMIN"),registerOfficerValidator,validateRequest,createOfficer);
router.get('/get-all-officer',protect,authorizeRoles("ADMIN"),getAllOfficers);
router.get('/get-all-citizen',protect,authorizeRoles("ADMIN"),getAllCitizen);
router.put("/:id",protect,authorizeRoles("ADMIN"),updateOfficer);

//lock and unloack officer
router.patch("/:id/lock",protect,authorizeRoles("ADMIN"),lockOfficer);
router.patch("/:id/unlock",protect,authorizeRoles("ADMIN"),unlockOfficer);

//activate and deactivate 
router.patch("/:id/deactivate",protect,authorizeRoles("ADMIN"),deactivateOfficer);
router.patch("/:id/activate",protect,authorizeRoles("ADMIN"),activateOfficer);

//reset password
router.post("/:id/reset-password",protect,authorizeRoles("ADMIN"),resetPassword);

//get all expired officers
router.get("/expired-passwords",protect,authorizeRoles("ADMIN"),getExpiredPasswordUsers);

//lock and unloack citizen
router.patch("/citizens/:id/lock",protect,authorizeRoles("ADMIN"),lockCitizen);
router.patch("/citizens/:id/unlock",protect,authorizeRoles("ADMIN"),unlockCitizen);


//office management
router.post('/offices',protect,authorizeRoles("ADMIN"),createOffice);
router.put('/offices/:id',protect,authorizeRoles("ADMIN"),updateOffice);
router.patch('/offices/:id/deActivate',protect,authorizeRoles("ADMIN"),deActivateOffice);
router.patch('/offices/:id/activate',protect,authorizeRoles("ADMIN"),activateOffice);

//global setting
router.get("/admin/system-settings",protect,authorizeRoles("ADMIN"),createSystemDefaultSetting);
router.put("/admin/system-settings",protect,authorizeRoles("ADMIN"),updateTemplateSetting);



export default router;