import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest.js";

const validCategories = ["Foods", "Beverages", "Dessert"];

// 🧾 Tambah produk
export const validateCreateProduct = [
  body("title")
    .notEmpty()
    .withMessage("Judul produk wajib diisi")
    .isLength({ min: 3 })
    .withMessage("Judul produk minimal 3 karakter"),
  body("price")
    .isInt({ min: 0 })
    .withMessage("Harga harus angka positif"),
  body("category")
    .isIn(validCategories)
    .withMessage("Kategori harus salah satu dari: Foods, Beverages, Dessert"),
  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi tidak valid"),
  body("image")
    .optional()
    .isString()
    .withMessage("Nama file gambar tidak valid"),
  validateRequest,
];

// ✏️ Update produk
export const validateUpdateProduct = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Judul produk minimal 3 karakter"),
  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Harga harus angka positif"),
  body("category")
    .optional()
    .isIn(validCategories)
    .withMessage("Kategori harus salah satu dari: food, drink, other"),
  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi tidak valid"),
  body("image")
    .optional()
    .isString()
    .withMessage("Nama file gambar tidak valid"),
  validateRequest,
];
