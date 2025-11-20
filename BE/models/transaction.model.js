import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(50),
        defaultValue: () => uuidv4(),
      },
      users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_type: {
        type: DataTypes.ENUM("dine-in", "takeaway", "online"),
        allowNull: true,
      },
      customer_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      table_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "transaction",
      timestamps: false,
      paranoid: true,
    }
  );

  // 🔄 Update timestamp otomatis
  Transaction.beforeUpdate((trx) => {
    trx.updated_at = new Date();
  });

  return Transaction;
};
