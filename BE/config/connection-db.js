import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// 🔧 Gunakan parameter style klasik Sequelize v6
const sequelize = new Sequelize(
  process.env.DB_NAME || "dbpos",
  process.env.DB_USER || "neondb_owner",
  process.env.DB_PASS || "npg_1fj6lkHTSpvO",
  {
    host:
      process.env.DB_HOST ||
      "ep-royal-bird-a1qx9ayi-pooler.ap-southeast-1.aws.neon.tech",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// ✅ Tes koneksi
try {
  await sequelize.authenticate();
  console.log("✅ Database connection has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error.message);
}

export default sequelize;
