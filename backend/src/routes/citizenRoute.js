import express from 'express';
import { getAllApplications, getCitizeninfo,  updateAddress, updatePassword } from '../Controllers/citizenController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validCitizen } from '../validators/validateCitizen.js';
import { applyCertificate } from '../Controllers/applicationController.js';
import upload from '../middleware/uploadMiddleware.js';

const router=express.Router();

router.get('/profile',protect,validCitizen,getCitizeninfo);
router.put('/profile/update-password',protect,validCitizen,updatePassword);
router.put('/profile/update-address',protect,validCitizen,updateAddress);

//apply to certificates
router.post('/apply/new-certificate',protect,validCitizen,upload.array("documents"),applyCertificate);
router.get('/get-allApplication',protect,validCitizen,getAllApplications);


export default router;
