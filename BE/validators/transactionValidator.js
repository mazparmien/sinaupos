import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest.js";

// ✅ Validasi input transaksi
export const transactionValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Daftar item wajib diisi dan minimal 1 item"),

  body("items.*.product_id")
    .notEmpty()
    .withMessage("product_id wajib diisi")
    .isInt({ gt: 0 })
    .withMessage("product_id harus berupa angka"),

  body("items.*.qty")
    .notEmpty()
    .withMessage("Jumlah (qty) wajib diisi")
    .isInt({ gt: 0 })
    .withMessage("Jumlah harus lebih besar dari 0"),

  body("items.*.price")
    .notEmpty()
    .withMessage("Harga wajib diisi")
    .isFloat({ gt: 0 })
    .withMessage("Harga harus berupa angka positif"),

  body("total")
    .notEmpty()
    .withMessage("Total wajib diisi")
    .isFloat({ gt: 0 })
    .withMessage("Total harus berupa angka positif"),

  body("payment_method")
    .notEmpty()
    .withMessage("Metode pembayaran wajib diisi")
    .isIn(["cash", "transfer", "qris"])
    .withMessage("Metode pembayaran hanya boleh: cash, transfer, atau qris"),

  validateRequest,
];
