import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📝 Register user baru
router.post("/register", validateRegister, registerUser);

// 🔐 Login user
router.post("/login", validateLogin, loginUser);

// 👤 Get profile (butuh token)
router.get("/profile", verifyToken, getProfile);

export default router;
