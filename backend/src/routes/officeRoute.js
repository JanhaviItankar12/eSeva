import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizedRoles.js";
import { getActiveDistricts, getActiveGramPanchayatsByTehsil, getActiveTehsilsByDistrict, getDistricts, getGramPanchayatsByTehsil, getOfficeById, getOffices, getTehsilsByDistrict } from "../Controllers/Admin/officeController.js";


const router=express.Router();

router.use(protect);

router.get('/',getOffices);

// Get all districts
router.get('/districts', getDistricts);

// Get tehsils by district
router.get('/tehsils/:districtId',  getTehsilsByDistrict);

// Get gram panchayats by tehsil
router.get('/gram-panchayats/:tehsilId',  getGramPanchayatsByTehsil);


// Get all active districts
router.get('/districts/active', getActiveDistricts);

// Get active tehsils by district
router.get('/tehsils/:districtId/active',  getActiveTehsilsByDistrict);

// Get  active gram panchayats by tehsil
router.get('/gram-panchayats/:tehsilId/active',  getActiveGramPanchayatsByTehsil);

router.get('/:id', getOfficeById);

export default router;

