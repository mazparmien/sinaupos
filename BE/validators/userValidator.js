import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest.js";

// 🧩 Validasi tambah user
export const validateCreateUser = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  validateRequest, // Middleware global validasi
];

// 🧩 Validasi update user
export const validateUpdateUser = [
  body("name").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Format email tidak valid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  // body("role")
  //   .optional()
  //   .isIn(["admin", "cashier", "owner"])
  //   .withMessage("Role tidak valid"),
  validateRequest,
];
