import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { settingValidator } from "../validators/settingValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { updateSetting } from "../controllers/settingController.js";

const router = express.Router();

// ⚙️ Update pengaturan sistem (khusus role owner)
router.put(
  "/",
  verifyToken,
  authorizeRoles("owner"),
  settingValidator,
  validateRequest,
  updateSetting
);

export default router;
