import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Pindahkan ini ke atas sebelum routes lain
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Tes aja biar kelihatan di console
console.log("📂 Serving static files from:", path.join(__dirname, "uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingRoutes);

app.get("/", (req, res) => res.send("✅ POS Backend API is running..."));

// Sync to database
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully."))
  .catch((err) => console.error("❌ Database connection failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
