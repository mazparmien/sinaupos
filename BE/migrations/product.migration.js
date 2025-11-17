export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: Sequelize.STRING(50) },
    title: { type: Sequelize.STRING(191), allowNull: false },
    description: { type: Sequelize.TEXT },
    price: { type: Sequelize.INTEGER, allowNull: false },
    category: { type: Sequelize.ENUM("Foods", "Beverages", "Desert"), allowNull: false },
    image: { type: Sequelize.STRING(191) },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    deleted_at: { type: Sequelize.DATE },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("products");
}
