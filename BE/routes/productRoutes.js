import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/productValidator.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * ✅ PRODUCT ROUTES (lengkap dengan autentikasi + upload gambar)
 * - Semua route tetap sama seperti sebelumnya
 * - POST & PUT kini bisa menerima upload gambar lewat `multipart/form-data`
 */

// 📦 Get all products (accessible by all authenticated users)
router.get("/", verifyToken, getAllProducts);

// 🔍 Get product by ID
router.get("/:id", verifyToken, getProductById);

// ➕ Create new product (admin & owner only, with file upload)
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "owner"),
  upload.single("image"), // 🟢 tambahkan upload handler
  validateCreateProduct,
  createProduct
);

// ✏️ Update product (admin & owner only, with optional new image)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  upload.single("image"), // 🟢 tambahkan upload handler
  validateUpdateProduct,
  updateProduct
);


// ❌ Delete product (owner only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteProduct);

export default router;
