export async function up(queryInterface) {
  await queryInterface.bulkInsert("transaction", [
    {
      uuid: "trx-001",
      users_id: 2, // Kasir 1
      order_number: 1001,
      order_type: "dine-in",
      customer_name: "Budi Santoso",
      table_number: 5,
      subtotal: 47000,
      tax: 3000,
      total: 50000,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: "trx-002",
      users_id: 2,
      order_number: 1002,
      order_type: "takeaway",
      customer_name: "Siti Rahma",
      table_number: null,
      subtotal: 25000,
      tax: 2500,
      total: 27500,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("transaction", null, {});
}
