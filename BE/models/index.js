
import sequelize from "../config/connection-db.js";
import { Sequelize } from "sequelize";
import UserModel from "./user.model.js";
import ProductModel from "./product.model.js";
import TransactionModel from "./transaction.model.js";
import TransactionItemModel from "./transactionItem.model.js";
import SettingModel from "./setting.model.js";

// 🔗 Inisialisasi semua model
export const User = UserModel(sequelize);
export const Product = ProductModel(sequelize);
export const Transaction = TransactionModel(sequelize);
export const TransactionItem = TransactionItemModel(sequelize);
export const Setting = SettingModel(sequelize);

// 🔗 Relasi antar model
User.hasMany(Transaction, { foreignKey: "users_id" });
Transaction.belongsTo(User, { foreignKey: "users_id" });

Transaction.hasMany(TransactionItem, { foreignKey: "transaction_id" });
TransactionItem.belongsTo(Transaction, { foreignKey: "transaction_id" });

Product.hasMany(TransactionItem, { foreignKey: "product_id" });
TransactionItem.belongsTo(Product, { foreignKey: "product_id" });

// ✅ Export default agar bisa di-import sebagai "db"
export default {
  sequelize,
  Sequelize, // <-- ini yang bikin `db.Sequelize` jadi ada
  User,
  Product,
  Transaction,
  TransactionItem,
  Setting,
};
