import express from "express";
import { activateOfficer, createOfficer, deactivateOfficer, getAllCitizen, getAllOfficers, getExpiredPasswordUsers, lockCitizen, lockOfficer, resetPassword, unlockCitizen, unlockOfficer, updateOfficer } from "../Controllers/Admin/createOfficer.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizedRoles.js";
import { registerOfficerValidator } from "../validators/authValidators.js";
import { validateRequest } from "../validators/validateRequest.js";
import { activateOffice, createOffice, deActivateOffice, updateOffice } from "../Controllers/Admin/officeController.js";

import { allCertificate, certificateById, createCertificate, toggleCertificateStatus, updateCertificate } from "../Controllers/Admin/certificateController.js";
import { getSystemSettings, updateSystemSetting } from "../Controllers/Admin/globalSettingController.js";
import { clearLogs, getAllLogs } from "../Controllers/Admin/logController.js";
import { createBackup, createSchedule, deleteBackup, deleteSchedule, getBackupHistory, getBackupSettingData, getSchedules, getStorageInfo, restoreBackup, toggleSchedule, updateBackupSettings, updateSchedule } from "../Controllers/Admin/BackupAndRestore.js";

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
router.get('/get/system-settings',protect,authorizeRoles("ADMIN"),getSystemSettings);
router.put('/update/system-settings',protect,authorizeRoles("ADMIN"),updateSystemSetting);

//certificate configuration
router.post('/create/certificate',protect,authorizeRoles("ADMIN"),createCertificate);
router.get("/certificates/all",protect,authorizeRoles("ADMIN"),allCertificate);
router.put("/certificate/:id",protect,authorizeRoles("ADMIN"),updateCertificate);

router.patch("/toggle-certificate-status/:id",protect,authorizeRoles("ADMIN"),toggleCertificateStatus);
router.get("/certificate/:id",protect,authorizeRoles("ADMIN"),certificateById);


//logs
router.get("/logs",protect,authorizeRoles("ADMIN"),getAllLogs);
router.delete("/logs",protect,authorizeRoles("ADMIN"), clearLogs);

//backup
router.get("/backups",protect,authorizeRoles("ADMIN"), getBackupHistory);
router.post("/backups",protect,authorizeRoles("ADMIN"), createBackup);
router.get("/schedules",protect,authorizeRoles("ADMIN"), getSchedules);
router.get("/storage", protect,authorizeRoles("ADMIN"),getStorageInfo);
router.post("/backups/:id/restore",protect,authorizeRoles("ADMIN"), restoreBackup);
router.delete("/backups/:id",protect,authorizeRoles("ADMIN"), deleteBackup);

// Schedule
router.post("/schedules",protect,authorizeRoles("ADMIN"), createSchedule);
router.put("/schedules/:id",protect,authorizeRoles("ADMIN"), updateSchedule);
router.delete("/schedules/:id",protect,authorizeRoles("ADMIN"), deleteSchedule);
router.patch("/schedules/:id/toggle",protect,authorizeRoles("ADMIN"), toggleSchedule);

// Settings
router.put("/settings/backup", protect,authorizeRoles("ADMIN"),updateBackupSettings);
router.get("/settings/backup",protect,authorizeRoles("ADMIN"),getBackupSettingData);


export default router;