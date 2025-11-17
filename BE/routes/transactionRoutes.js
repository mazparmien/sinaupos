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
  authorizeRoles("admin", "kasir", "owner"),
  transactionValidator,
  validateRequest,
  createTransaction
);

// 💰 Ambil Semua Transaksi
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "owner"),
  getAllTransactions
);

// 💰 Ambil Transaksi Berdasarkan ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "kasir", "owner"),
  getTransactionById
);

// 💰 Hapus Transaksi
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "owner"),
  deleteTransaction
);

export default router
