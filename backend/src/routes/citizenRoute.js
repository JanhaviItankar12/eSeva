import express from 'express';
import { getAllApplications, getCitizeninfo,  getDatafortrackApplication,  getSMSStatus,  getWhatsappStatus,  subscribeToSMS,  subscribeToWHATSAPP,  unsubscribeFromSMS,  unsubscribeFromWHATSAPP,  updateAddress, updatePassword } from '../Controllers/citizenController.js';
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
router.get('/get-data-for-trap-application/:applicationId',protect,validCitizen,getDatafortrackApplication);

//sms subscribtions
router.get('/get-sms-status/:applicationId',protect,validCitizen,getSMSStatus);
router.post('/enable-sms-subscribtion/:applicationId',protect,validCitizen,subscribeToSMS);
router.post('/disable-sms-subscribtion/:applicationId',protect,validCitizen,unsubscribeFromSMS);

//whatsapp subscribtions
router.get('/get-whatsapp-status/:applicationId',protect,validCitizen,getWhatsappStatus);
router.post('/enable-whatsapp-subscribtion/:applicationId',protect,validCitizen,subscribeToWHATSAPP);
router.post('/disable-whatsapp-subscribtion/:applicationId',protect,validCitizen,unsubscribeFromWHATSAPP);
export default router;
