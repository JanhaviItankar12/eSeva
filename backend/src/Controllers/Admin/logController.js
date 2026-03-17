import Log from "../../models/logs.js";

export const createLog = async (data) => {
  try {
    await Log.create(data);
  } catch (err) {
    console.log("Log error:", err.message);
  }
};


export const getAllLogs = async (req, res) => {
  try {
    const {
      type = "all",
      severity = "all",
      status = "all",
      user,
      dateRange = "all",
      page = 1,
      limit = 20
    } = req.query;

    let filter = {};

    // 🔹 Type filter
    if (type !== "all") {
      filter.type = type;
    }

    // 🔹 Severity filter
    if (severity !== "all") {
      filter.severity = severity;
    }

    // 🔹 Status filter
    if (status !== "all") {
      filter.status = status;
    }

    // 🔹 User filter
    if (user) {
      filter.user = user;
    }

    // 🔹 Date filter
    const now = new Date();

    if (dateRange === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      filter.timestamp = {
        $gte: start,
        $lte: now
      };
    }

    if (dateRange === "yesterday") {
      const start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);

      filter.timestamp = {
        $gte: start,
        $lte: end
      };
    }

    if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);

      filter.timestamp = {
        $gte: weekAgo
      };
    }

    if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);

      filter.timestamp = {
        $gte: monthAgo
      };
    }

    // 🔹 Pagination
    const skip = (page - 1) * limit;

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 }) // latest first
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: logs
    });

  } catch (error) {
    console.error("Get Logs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch logs"
    });
  }
};

export const clearLogs = async (req, res) => {
  try {
    const { type, severity, status } = req.query;

    let filter = {};

    if (type && type !== "all") filter.type = type;
    if (severity && severity !== "all") filter.severity = severity;
    if (status && status !== "all") filter.status = status;

    const result = await Log.deleteMany(filter);

    res.json({
      success: true,
      message: `${result.deletedCount} logs deleted`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear logs"
    });
  }
};