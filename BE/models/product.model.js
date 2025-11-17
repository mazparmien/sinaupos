import { DataTypes } from "sequelize";

const ProductModel = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.ENUM("Foods", "Beverages", "Dessert"),
        allowNull: false,
      },

    },
    {
      tableName: "products",
      timestamps: false, 
      paranoid: true, // soft delete pakai deletedAt
    }
  );

  return Product;
};

export default ProductModel;
