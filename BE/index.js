import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import db from "./models/index.js"; // ✅ Import default
const { sequelize } = db; // ✅ Ambil sequelize dari default export

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Setup __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ Layani file statis dari folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("📂 Serving static files from:", path.join(__dirname, "uploads"));

// ✅ Semua route lewat pintu utama
app.use("/api", apiRoutes);

// ✅ Root check
app.get("/", (req, res) => {
  res.send("✅ POS Backend API is running...");
});

// ✅ Tes koneksi database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Handler error global
app.use(errorHandler);
