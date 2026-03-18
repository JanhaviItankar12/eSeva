import Backup from "../../models/backup/backup.js";
import Schedule from "../../models/backup/schedule.js";
import SystemSetting from "../../models/systemSetting.js";
import RestoreBackup from "../../models/backup/restoreBackup.js";
import mongoose from "mongoose";

import fs from "fs";
import path from "path";
import { exec } from 'child_process';
import archiver from "archiver";


//helper  function
const getFolderStats = (dirPath) => {
  let totalSize = 0;
  let fileCount = 0;
  const databases = new Set();

  const walk = (currentPath) => {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        databases.add(file);
        walk(fullPath);
      } else {
        totalSize += stat.size; //  keep in bytes
        fileCount++;
      }
    });
  };

  walk(dirPath);

  return {
    size: totalSize, //  NUMBER (bytes)
    fileCount,
    databases: Array.from(databases)
  };
};

const takeAutoBackup = async (req) => {
  return new Promise((resolve, reject) => {
    const backupPath = `backups/auto/${Date.now()}`;

    const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupPath}"`;

    exec(cmd, async (error) => {
      if (error) return reject(error);

      let size = "0 MB";
      let fileCount = 0;
      let databases = [];

      if (fs.existsSync(backupPath)) {
        const stats = getFolderStats(backupPath);
        size = stats.size;
        fileCount = stats.fileCount;
        databases = stats.databases;
      }

      await Backup.create({
        name: "Pre-Restore Backup",
        type: "auto",
        status: "success",
        location: backupPath,
        size,              //  NEW
        files: fileCount,  //  NEW
        databases,         //  NEW
        createdBy: req.user?.id || 'unknown',
        createdByName: req.user?.role || 'unknown',
      });

      resolve(backupPath);
    });
  });
};

export const createBackup = async (req, res) => {
  try {
    // 1️ Ensure backup folder exists
    const basePath = path.join('backups', 'manual');
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

    const timestamp = Date.now();
    const backupPath = path.join(basePath, `${timestamp}`);

    // 2️ Build mongodump command
    const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupPath}"`;


    // 3️ Execute mongodump
    exec(cmd, async (error, stdout, stderr) => {

      const cleanWarnings = stderr
        ?.split('\n')
        .filter(line =>
          line.toLowerCase().includes('error') ||
          line.toLowerCase().includes('failed')
        )
        .join('\n');

      let status = 'success';
      if (error) status = 'failed';
      else if (cleanWarnings) status = 'warning';

      try {
        //  NEW: Get backup stats
        let size = "0 MB";
        let fileCount = 0;
        let databases = [];

        if (fs.existsSync(backupPath)) {
          const stats = getFolderStats(backupPath);
          size = stats.size;
          fileCount = stats.fileCount;
          databases = stats.databases;
        }

        //  Save in DB
        const backup = await Backup.create({
          name: 'Manual Backup',
          type: 'manual',
          status,
          location: backupPath,

          size,              //  NEW
          files: fileCount,  //  NEW
          databases,         //  NEW

          createdBy: req.user?.id || 'unknown',
          createdByName: req.user?.role || 'unknown',
          warning: cleanWarnings || null,
          error: error?.message || null,
        });

        res.status(200).json({
          success: true,
          message:
            status === 'success'
              ? 'Backup completed successfully'
              : 'Backup completed with warnings',
          data: backup,
          warnings: stderr || null,
        });

      } catch (dbErr) {
        console.error('DB save error:', dbErr);
        res.status(200).json({
          success: false,
          message: 'Backup completed but failed to save metadata',
          error: dbErr.message
        });
      }
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: err.message
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



export const downloadBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);


    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found",
      });
    }

    const folderPath = backup.location;

    //  Check if backup exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        message: "Backup folder not found",
      });
    }

    //  Set headers for download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup-${backup._id}.zip`
    );

    //  Create archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    //  Handle archiver errors
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).end();
    });

    //  Pipe archive → response
    archive.pipe(res);

    //  Add folder to zip
    archive.directory(folderPath, false);

    //  Finalize archive
    await archive.finalize();

  } catch (error) {
    console.error("Download error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Download failed",
        error: error.message,
      });
    }
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

    //  Backup size already number (bytes)
    const backupsSize = backups.reduce((acc, b) => acc + (b.size || 0), 0);

    //  Example paths (adjust as per your project)
    const uploadsPath = path.join("uploads");
    const logsPath = path.join("logs");

    //  Helper function to calculate folder size
    const getFolderSize = (dirPath) => {
      let total = 0;

      if (!fs.existsSync(dirPath)) return 0;

      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          total += getFolderSize(filePath);
        } else {
          total += stats.size;
        }
      }

      return total;
    };

    const filesSize = getFolderSize(uploadsPath);
    const logsCollection = mongoose.connection.db.collection("logs");

    let logsSize = 0;

    try {
      const result = await logsCollection.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: { $bsonSize: "$$ROOT" } }
          }
        }
      ]).toArray();

      logsSize = result[0]?.totalSize || 0;

    } catch (err) {
      console.log("Logs size error:", err.message);
    }

    //  Database size (approx)
    const dbStats = await mongoose.connection.db.stats();
    const databaseSize = dbStats.dataSize || 0;

    //  Total disk (example: 100GB)
    const TOTAL_STORAGE = 100 * 1024 * 1024 * 1024; // bytes

    const used = backupsSize + databaseSize + filesSize + logsSize;
    const free = TOTAL_STORAGE - used;
    const usagePercentage = ((used / TOTAL_STORAGE) * 100).toFixed(2);

    res.json({
      success: true,
      data: {
        total: TOTAL_STORAGE,
        used,
        free: free > 0 ? free : 0,
        usagePercentage: Number(usagePercentage),

        // Breakdown
        backups: backupsSize,
        databases: databaseSize,
        files: filesSize,
        logs: logsSize
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch storage info"
    });
  }
};



export const restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);
    if (!backup) {
      return res.status(404).json({ message: "Backup not found" });
    }

    //  Step 1: Safety backup
    await takeAutoBackup(req);

    //  Step 2: Restore
    const cmd = `mongorestore --uri="${process.env.MONGO_URI}" --drop "${backup.location}"`;

    exec(cmd, async (error, stdout, stderr) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Restore failed",
          error: error.message
        });
      }

      //  Step 3: Log restore
      await RestoreBackup.create({
        backupId: backup._id,
        performedBy: req.user?.id,
        performedByName: req.user?.name
      });

      res.json({
        success: true,
        message: "Backup restored successfully"
      });
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Restore failed"
    });
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
    const { status } = req.body; // expect true/false

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    //  If status is sent → use it
    if (typeof status === "boolean") {
      schedule.status = status;
    }
    //  Otherwise toggle automatically
    else {
      schedule.status = !schedule.status;
    }

    await schedule.save();

    res.status(200).json({
      success: true,
      message: `Schedule ${schedule.status ? "enabled" : "disabled"} successfully`,
      data: schedule
    });

  } catch (error) {
    console.error("Toggle Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle schedule",
      error: error.message
    });
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

export const getBackupSettingData = async (req, res) => {
  try {
    const backupSettingData = await SystemSetting.find().select("backupLocation  backupRetention  maxBackupSize compressionLevel enableCompression verifyIntegrity enableEmailNotifications createRestorePoint  verifyAfterRestore maintainDuringRestore rto rpo");
    if (!backupSettingData) {
      return res.status(404).json({
        message: "Backup Setting Data not found!"
      })
    }

    return res.status(200).json({
      message: "Backup Setting Data fetched Successfully!",
      backupSettingData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });
  }
}

export const cleanupStorage = async (req, res) => {
  try {
    const { type, days } = req.query;

    if (!type || !days) {
      return res.status(400).json({
        success: false,
        message: "Type and days are required"
      });
    }

    const daysNumber = parseInt(days);

    //  Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysNumber);

    let deletedCount = 0;
    let freedSpace = 0;

    // ===========================
    //  CLEAN BACKUPS
    // ===========================
    if (type === "backups") {
      const oldBackups = await Backup.find({
        createdAt: { $lt: cutoffDate }
      });

      for (const backup of oldBackups) {
        try {
          // delete folder from disk
          if (backup.location && fs.existsSync(backup.location)) {
            fs.rmSync(backup.location, { recursive: true, force: true });
          }

          freedSpace += backup.size || 0;
          await Backup.findByIdAndDelete(backup._id);

          deletedCount++;
        } catch (err) {
          console.log("Error deleting backup:", err.message);
        }
      }
    }

    // ===========================
    //  CLEAN LOGS
    // ===========================
    if (type === "logs") {
      const logsCollection = mongoose.connection.db.collection("logs");

      const result = await logsCollection.deleteMany({
        createdAt: { $lt: cutoffDate }
      });

      deletedCount = result.deletedCount;

      // optional: approx freed space
      freedSpace = deletedCount * 1000; // approx
    }

    // ===========================
    //  RESPONSE
    // ===========================
    res.json({
      success: true,
      message: `${type} cleaned successfully`,
      deletedCount,
      freedSpace // bytes (approx for logs)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Cleanup failed"
    });
  }
};






