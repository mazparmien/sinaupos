import express from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import reportRoutes from "./reportRoutes.js";
import settingRoutes from "./settingRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// 🔐 Authentication
router.use("/auth", authRoutes);

// 🧾 Transaksi
router.use("/transactions", transactionRoutes);

// 📦 Produk
router.use("/products", productRoutes);

// 👥 User Management
router.use("/users", userRoutes);

// 📊 Laporan
router.use("/reports", reportRoutes);

// ⚙️ Pengaturan
router.use("/settings", settingRoutes);

export default router;
