import express from "express";
import { createOfficer, getAllOfficers } from "../Controllers/Admin/createOfficer.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizedRoles.js";
import { registerOfficerValidator } from "../validators/authValidators.js";
import { validateRequest } from "../validators/validateRequest.js";
import { activateOffice, createOffice, deActivateOffice, updateOffice } from "../Controllers/Admin/officeController.js";

const router=express.Router();

//officer management
router.post('/create-officer',protect,authorizeRoles("ADMIN"),registerOfficerValidator,validateRequest,createOfficer);
router.get('/get-all-officer',protect,authorizeRoles("ADMIN"),getAllOfficers);

//office management
router.post('/offices',protect,authorizeRoles("ADMIN"),createOffice);
router.put('/offices/:id',protect,authorizeRoles("ADMIN"),updateOffice);
router.patch('/offices/:id/deActivate',protect,authorizeRoles("ADMIN"),deActivateOffice);
router.patch('/offices/:id/activate',protect,authorizeRoles("ADMIN"),activateOffice);

export default router;