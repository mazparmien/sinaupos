export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("transaction_items", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: Sequelize.STRING(50) },
    transaction_id: {
      type: Sequelize.INTEGER,
      references: { model: "transaction", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: { model: "products", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    qty: { type: Sequelize.INTEGER, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: false },
    notes: { type: Sequelize.STRING(50) },
    subtotal_item: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    deleted_at: { type: Sequelize.DATE },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("transaction_items");
}
