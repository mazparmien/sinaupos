import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { reportValidator } from "../validators/reportValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { getSalesReport } from "../controllers/reportController.js";

const router = express.Router();

// 📊 Route: laporan penjualan
router.get(
  "/sales",
  verifyToken,
  authorizeRoles("admin", "owner"),
  reportValidator,
  validateRequest,
  getSalesReport
);

// ✅ Export default router
export default router;
