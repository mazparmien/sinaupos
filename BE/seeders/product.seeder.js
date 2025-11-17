export async function up(queryInterface) {
  await queryInterface.bulkInsert("products", [
    {
      uuid: "prd-001",
      title: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayur.",
      price: 25000,
      category: "food",
      image: "https://picsum.photos/200?food1",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: "prd-002",
      title: "Es Teh Manis",
      description: "Teh segar dengan gula tebu asli.",
      price: 8000,
      category: "drink",
      image: "https://picsum.photos/200?drink1",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      uuid: "prd-003",
      title: "Mie Goreng Ayam",
      description: "Mie goreng lezat dengan potongan ayam.",
      price: 22000,
      category: "food",
      image: "https://picsum.photos/200?food2",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("products", null, {});
}
