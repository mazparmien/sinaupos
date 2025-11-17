import { query } from "express-validator";

export const reportValidator = [
  query("start_date")
    .notEmpty().withMessage("Tanggal awal wajib diisi")
    .isISO8601().withMessage("Format tanggal tidak valid (gunakan YYYY-MM-DD)"),
  query("end_date")
    .notEmpty().withMessage("Tanggal akhir wajib diisi")
    .isISO8601().withMessage("Format tanggal tidak valid")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.query.start_date)) {
        throw new Error("Tanggal akhir tidak boleh lebih kecil dari tanggal awal");
      }
      return true;
    }),
];
