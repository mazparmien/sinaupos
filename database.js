import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// 🔧 Koneksi ke Neon PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false, // set true jika ingin lihat query SQL di console
  }
);

// 🧪 Test koneksi otomatis
try {
  await sequelize.authenticate();
  console.log("✅ Database connection has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error.message);
}

export default sequelize;
