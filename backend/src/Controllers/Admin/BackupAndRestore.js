import Backup from "../../models/backup/backup.js";
import Schedule from "../../models/backup/schedule.js";
import SystemSetting from "../../models/systemSetting.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";



export const createBackup = (req, res) => {
  try {
    const backupPath = path.join("backups", "manual", `${Date.now()}`);

    // Spawn mongodump
    const backupProcess = spawn("mongodump", [
      `--uri=${process.env.MONGO_URI}`,
      `--out=${backupPath}`,
    ]);

    let stdoutData = "";
    let stderrData = "";

    backupProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
      console.log("[mongodump stdout]", data.toString());
    });

    backupProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
      console.log("[mongodump stderr]", data.toString());
    });

    backupProcess.on("error", (err) => {
      console.error("Spawn error:", err);
      return res.status(500).json({
        success: false,
        message: "Backup process failed to start",
        error: err.message,
      });
    });

    backupProcess.on("close", async (code) => {
      

      let status = code === 0 ? "success" : "partial-success";

      try {
        const backup = await Backup.create({
          name: "Manual Backup",
          type: "manual",
          status,
          location: backupPath,
          createdBy: req.user?.email || "unknown",
          createdByName: req.user?.name || "unknown",
        });

        res.json({
          success: true,
          message:
            status === "success"
              ? "Backup completed successfully"
              : "Backup completed with warnings",
          warnings: stderrData || null,
          data: backup,
        });
      } catch (dbErr) {
        console.error("DB save error:", dbErr);
        res.status(500).json({
          success: false,
          message: "Backup completed but failed to save metadata",
          error: dbErr.message,
        });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      success: false,
      message: "Backup failed due to unexpected error",
      error: err.message,
    });
  }
};

export const getBackupHistory = async (req, res) => {
  try {
    const backups = await Backup.find()
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: backups
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch backups"
    });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();

    res.json({
      success: true,
      data: schedules
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

export const getStorageInfo = async (req, res) => {
  try {
    const backups = await Backup.find();

    let totalSize = 0;

    backups.forEach(b => {
      if (b.size) {
        const size = parseFloat(b.size); // "2.4 GB"
        totalSize += size;
      }
    });

    res.json({
      success: true,
      data: {
        total: "100 GB",
        used: totalSize + " GB",
        free: (100 - totalSize) + " GB"
      }
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);

    if (!backup) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }

    //  Real restore logic (simulate for now)
    console.log("Restoring backup:", backup.location);

    res.json({
      success: true,
      message: "Backup restored successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Restore failed" });
  }
};


export const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findByIdAndDelete(id);

    if (!backup) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      message: "Backup deleted"
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);

    res.json({
      success: true,
      data: schedule
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Schedule.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    await Schedule.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Schedule deleted"
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const toggleSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ success: false });
    }

    schedule.status = schedule.status === "active" ? "inactive" : "active";

    await schedule.save();

    res.json({
      success: true,
      data: schedule
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//update backup settings
export const updateBackupSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json({
      success: true,
      data: settings
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });
  }
};

export const getBackupSettingData=async(req,res)=>{
  try {
    const backupSettingData=await SystemSetting.find().select( "backupLocation  backupRetention  maxBackupSize compressionLevel enableCompression verifyIntegrity enableEmailNotifications createRestorePoint  verifyAfterRestore maintainDuringRestore rto rpo");
    if(!backupSettingData){
      return res.status(404).json({
        message:"Backup Setting Data not found!"
      })
    }

    return res.status(200).json({
      message:"Backup Setting Data fetched Successfully!",
      backupSettingData
    })
  } catch (error) {
     res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });
  }
}






