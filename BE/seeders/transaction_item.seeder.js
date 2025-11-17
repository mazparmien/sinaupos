export async function up(queryInterface) {
  await queryInterface.bulkInsert("transaction_items", [
    {
      uuid: "trxi-001",
      transaction_id: 3,
      product_id: 1,
      qty: 1,
      price: 25000,
      notes: "Tidak pedas",
      subtotal_item: 25000,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: "trxi-002",
      transaction_id: 4,
      product_id: 2,
      qty: 2,
      price: 8000,
      notes: "",
      subtotal_item: 16000,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: "trxi-003",
      transaction_id: 4,
      product_id: 3,
      qty: 1,
      price: 22000,
      notes: "Tambah ayam",
      subtotal_item: 22000,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("transaction_items", null, {});
}
