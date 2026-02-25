import fs from "fs";
import path from "path";
import User from "../../models/user.js";
import Application from "../../models/application.js";
import Backup from "../../models/admin/backup.js";

// For __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBackup = async (req, res) => {
  try {
    const users = await User.find();
    const applications = await Application.find();

    const data = { users, applications };

    const fileName = `backup-${Date.now()}.json`;
    const filePath = path.join(__dirname, "../backups", fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    const stats = fs.statSync(filePath);

    await Backup.create({
      fileName,
      size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
      type: "manual",
      status: "success"
    });

    res.status(200).json({ message: "Backup Created Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Backup Failed" });
  }
};


export const restoreBackup = async (req, res) => {
  try {
    const { fileName } = req.body;

    const filePath = path.join(__dirname, "../backups", fileName);

    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    // Clear current data
    await User.deleteMany({});
    await Application.deleteMany({});

    // Insert backup data
    await User.insertMany(data.users);
    await Application.insertMany(data.applications);

    res.status(200).json({ message: "System Restored Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Restore Failed" });
  }
};


export const getBackupHistory = async (req, res) => {
  const backups = await Backup.find().sort({ createdAt: -1 });
  res.json(backups);
};

export const downloadBackup = (req, res) => {
  const filePath = path.join(__dirname, "../backups", req.params.fileName);
  res.download(filePath);
};


