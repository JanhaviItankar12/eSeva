import { createLog } from "../Controllers/Admin/logController.js";

export const apiLogger = async (req, res, next) => {

  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    await createLog({
      type: "api",
      category: "performance",
      severity: duration > 1000 ? "warning" : "info",
      user: req.user?.email || "guest",
      action: `${req.method} ${req.originalUrl}`,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: duration,
      ip: req.ip,
      status: res.statusCode >= 400 ? "error" : "success"
    });
  });

  next();
};