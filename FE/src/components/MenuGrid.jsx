import React, { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { apiFetch } from "../services/apiFetch";

export default function MenuGrid({ category = "all", onAddToCart, onEditProduct }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const STATIC_URL = BASE_URL.replace("/api", "");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        let url = `/products`;
        if (category && category !== "all") {
          url += `?category=${category}`;
        }

        const data = await apiFetch(url);
        if (data.success) {
          const formatted = data.data.map((item) => ({
            ...item,
            image: item.image?.startsWith("http")
              ? item.image
              : item.image
              ? `${STATIC_URL}/${item.image.replace(/^\//, "")}`
              : "/assets/images/no-image.png",
          }));
          setMenus(formatted);
        }
      } catch (err) {
        console.error("❌ Gagal ambil data produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [category]);

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading...</p>;

  if (menus.length === 0)
    return (
      <p className="text-gray-400 text-center mt-6 italic">
        Tidak ada menu ditemukan
      </p>
    );

  return (
    <div className="grid grid-cols-4 gap-5 mt-6">
      {menus.map((menu) => (
        <MenuCard
          key={menu.id}
          title={menu.title}
          description={menu.description}
          price={menu.price}
          image={menu.image}
          category={menu.category} // ✅ penting agar badge muncul
          onClick={() => {
            if (onAddToCart) onAddToCart(menu);
            else if (onEditProduct) onEditProduct(menu);
          }}
        />
      ))}
    </div>
  );
}
