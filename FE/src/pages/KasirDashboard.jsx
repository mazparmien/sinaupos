import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import MenuGrid from "../components/MenuGrid";
import OrderPanel from "../components/OrderPanel";

const KasirDashboard = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 🟢 ubah jadi lowercase

  // ✅ Tambah ke keranjang (kalau sudah ada, tambah qty saja)
  const handleAddToCart = (menu) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === menu.id);
      if (existing) {
        // Sudah ada, tambahkan qty
        return prevCart.map((item) =>
          item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Belum ada, buat item baru
        return [...prevCart, { ...menu, qty: 1 }];
      }
    });
  };

  // ✅ Hapus item berdasarkan index
  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Update jumlah (qty)
  const handleUpdateQty = (menu, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === menu.id ? { ...item, qty: newQty } : item
      )
    );
  };

  // ✅ Update note
  const handleUpdateNote = (menu, note) => {
    setCart((prev) =>
      prev.map((item) => (item.id === menu.id ? { ...item, note } : item))
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 p-6 overflow-y-auto">
            {/* 🟢 Ubah ke lowercase dan passing handler */}
            <CategoryTabs
              onChangeCategory={(cat) =>
                setSelectedCategory(cat === "All Menu" ? "all" : cat)
              }
            />
            <MenuGrid
              category={selectedCategory}
              onAddToCart={handleAddToCart}
            />
          </main>

          <aside className="w-[420px] bg-white border-l border-gray-200 h-full overflow-y-auto">
            <OrderPanel
              cart={cart}
              onRemove={handleRemove}
              onUpdateQty={handleUpdateQty}
              onUpdateNote={handleUpdateNote}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default KasirDashboard;
