import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import MenuGrid from "../components/MenuGrid";
import ProductPanel from "../components/ProductPanel";
import { Plus } from "lucide-react";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔁 Refresh ulang data product setelah Add/Edit/Delete
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // 🖋 Klik produk → tampilkan detail panel
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  // ➕ Klik tambah → form kosong
  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  // ❌ Tutup panel kanan
  const handleClosePanel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar kiri */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* ====== KIRI (LIST MENU) ====== */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800">List Menu</h1>
              <span className="text-gray-500 text-sm">
                Total{" "}
                <span className="font-semibold text-gray-700">30 Menu</span>
              </span>
            </div>

            {/* Tabs kategori */}
            <CategoryTabs
              onChangeCategory={(cat) =>
                setSelectedCategory(cat === "All Menu" ? "all" : cat)
              }
            />

            {/* Grid produk */}
            <div className="mt-6">
              <MenuGrid
                key={refreshKey}
                category={selectedCategory}
                onEditProduct={handleEditProduct}
              />
            </div>
          </main>

          {/* ====== KANAN (PANEL DETAIL / ADD MENU) ====== */}
          <aside className="w-[420px] border-l border-gray-200 bg-white flex flex-col">
            {/* Isi Panel */}
            {showForm ? (
              <ProductPanel
                product={selectedProduct}
                onClose={handleClosePanel}
                onRefresh={handleRefresh}
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Add Menu
                  </h2>
                  <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg shadow transition"
                    title="Add new menu"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-1 items-center justify-center text-gray-400 text-sm italic">
                  Add Menu here
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
