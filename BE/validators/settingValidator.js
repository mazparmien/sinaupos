import { body } from "express-validator";

export const settingValidator = [
  body("store_name")
    .notEmpty().withMessage("Nama toko wajib diisi"),
  body("address")
    .notEmpty().withMessage("Alamat toko wajib diisi"),
  body("tax_rate")
    .isFloat({ min: 0 }).withMessage("Pajak harus bernilai angka (bisa 0)"),
  body("currency")
    .isIn(["IDR", "USD"]).withMessage("Mata uang tidak valid"),
];
