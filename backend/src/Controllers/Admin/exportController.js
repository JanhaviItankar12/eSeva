import fs from "fs";
import path from "path";
import Export from "../../models/export.js";
import ExportTemplate from "../../models/template.js";



export const exportData = async (req, res) => {
  try {
    const { type, format } = req.body;

    const data = [{ sample: "data" }]; //  replace with real DB fetch

    const fileName = `${type}-${Date.now()}.${format}`;
    const filePath = path.join("exports", fileName);

    if (!fs.existsSync("exports")) fs.mkdirSync("exports");

    // JSON export
    if (format === "json") {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    // CSV export (basic)
    if (format === "csv") {
      const csv = Object.keys(data[0]).join(",") + "\n" +
        data.map(row => Object.values(row).join(",")).join("\n");

      fs.writeFileSync(filePath, csv);
    }

    const stats = fs.statSync(filePath);

    const exportDoc = await Export.create({
      name: fileName,
      type,
      format,
      filePath,
      size: stats.size,
      createdBy: req.user?.email || "admin"
    });

    res.json({ success: true, data: exportDoc });

  } catch (err) {
    res.status(500).json({ success: false, message: "Export failed" });
  }
};


export const getExportHistory = async (req, res) => {
  try {
    const exports = await Export.find().sort({ createdAt: -1 });
    res.json({ success: true, data: exports });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteExport = async (req, res) => {
  try {
    const { id } = req.params;

    const exp = await Export.findById(id);
    if (!exp) return res.status(404).json({ message: "Not found" });

    if (fs.existsSync(exp.filePath)) {
      fs.unlinkSync(exp.filePath);
    }

    await Export.findByIdAndDelete(id);

    res.json({ success: true, message: "Deleted" });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const downloadExport = async (req, res) => {
  try {
    const { id } = req.params;

    const exp = await Export.findById(id);
    if (!exp) return res.status(404).json({ message: "Not found" });

    res.download(exp.filePath);

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const getExportPreview = async (req, res) => {
  try {
    const { id } = req.params;

    const exp = await Export.findById(id);
    if (!exp) return res.status(404).json({ message: "Not found" });

    const data = fs.readFileSync(exp.filePath, "utf-8");

    res.json({
      success: true,
      preview: data.slice(0, 500) // first 500 chars
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const createExportTemplate = async (req, res) => {
  try {
    const template = await ExportTemplate.create({
      ...req.body,
      createdBy: req.user?.email || "admin"
    });

    res.json({ success: true, data: template });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteExportTemplate = async (req, res) => {
  try {
    await ExportTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getExportTemplates = async (req, res) => {
  try {
    const templates = await ExportTemplate.find();
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};






