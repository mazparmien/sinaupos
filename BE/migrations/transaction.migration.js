export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("transaction", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: Sequelize.STRING(50) },
    users_id: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    order_number: { type: Sequelize.INTEGER },
    order_type: { type: Sequelize.ENUM("dine-in", "takeaway", "online"), allowNull: false },
    customer_name: { type: Sequelize.STRING(50) },
    table_number: { type: Sequelize.INTEGER },
    subtotal: { type: Sequelize.INTEGER, defaultValue: 0 },
    tax: { type: Sequelize.INTEGER, defaultValue: 0 },
    total: { type: Sequelize.INTEGER, defaultValue: 0 },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    deleted_at: { type: Sequelize.DATE },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("transaction");
}
