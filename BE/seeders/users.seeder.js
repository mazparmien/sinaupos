export async function up(queryInterface) {
  await queryInterface.bulkInsert("users", [
    {
      name: "Admin POS",
      email: "admin@pos.com",
      password: "$2a$10$uIuBtP6kY4u0nYOOn2GmQO6s3uk3YljdXsyY3nIgw3mRp5tQq5PGO", // hash 'admin123'
      role: "admin",
      status: "active",
      image_profile: "https://i.pravatar.cc/150?img=1",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Kasir 1",
      email: "kasir1@pos.com",
      password: "$2a$10$uIuBtP6kY4u0nYOOn2GmQO6s3uk3YljdXsyY3nIgw3mRp5tQq5PGO", // hash 'admin123'
      role: "cashier",
      status: "active",
      image_profile: "https://i.pravatar.cc/150?img=2",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", null, {});
}
