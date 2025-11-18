import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { transactionValidator } from "../validators/transactionValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 💰 Tambah Transaksi Baru
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "cashier"),
  transactionValidator,
  validateRequest,
  createTransaction
);

// 💰 Ambil Semua Transaksi
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "cashier"),
  getAllTransactions
);

// 💰 Ambil Transaksi Berdasarkan ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "cashier"),
  getTransactionById
);

// 💰 Hapus Transaksi
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteTransaction
);

export default router
