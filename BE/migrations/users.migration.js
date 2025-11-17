export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: Sequelize.STRING(191),
    email: { type: Sequelize.STRING(191), unique: true },
    password: Sequelize.STRING(191),
    role: Sequelize.ENUM("admin", "cashier", "owner"),
    status: Sequelize.ENUM("active", "inactive"),
    image_profile: Sequelize.STRING(200),
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    deleted_at: Sequelize.DATE,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
