export async function up(queryInterface) {
  await queryInterface.bulkInsert("setting", [
    { uuid: "set-001", key: "store_name", value: "TrisaPOS" },
    { uuid: "set-002", key: "store_address", value: "Jl. Mawar No. 12, Jakarta" },
    { uuid: "set-003", key: "store_phone", value: "0812-3456-7890" },
    { uuid: "set-004", key: "tax_rate", value: "10" },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("setting", null, {});
}
