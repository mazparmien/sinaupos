export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("setting", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: Sequelize.STRING(20) },
    key: { type: Sequelize.STRING(50), unique: true, allowNull: false },
    value: { type: Sequelize.STRING(50), allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("setting");
}
