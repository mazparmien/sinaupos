import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest.js";

export const validateRegister = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Minimal 6 karakter"),
  validateRequest,
];

export const validateLogin = [
  // body("email").isEmail().withMessage("Email tidak valid"),
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
  validateRequest,
];
