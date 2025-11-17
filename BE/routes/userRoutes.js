import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { validateCreateUser, validateUpdateUser } from "../validators/userValidator.js";

const router = express.Router();

// 👥 Hanya admin & owner yang bisa melihat daftar user
router.get("/", verifyToken, authorizeRoles("admin", "owner"), getAllUsers);

// 👀 Lihat detail user (admin & owner)
router.get("/:id", verifyToken, authorizeRoles("admin", "owner"), getUserById);

// ➕ Tambah user baru (admin & owner)
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "owner"),
  validateCreateUser,
  createUser
);

// ✏️ Update user (admin & owner)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  validateUpdateUser,
  updateUser
);

// ❌ Hapus user (admin & owner)
router.delete("/:id", verifyToken, authorizeRoles("admin", "owner"), deleteUser);

export default router;
