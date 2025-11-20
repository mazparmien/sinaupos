import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { reportValidator } from "../validators/reportValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { getSalesReport, getDashboardReport } from "../controllers/reportController.js";

const router = express.Router();

// 📊 Route: laporan penjualan
router.get(
  "/sales",
  verifyToken,
  authorizeRoles("admin", "cashier"),
  reportValidator,
  validateRequest,
  getSalesReport
);

// 📌 NEW: Dashboard Summary
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("admin", "cashier"),
  getDashboardReport
);

export default router;
