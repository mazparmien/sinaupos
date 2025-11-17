import React, { useState } from "react";
import { Maximize2 } from "lucide-react";

export default function MenuCard({
  title,
  description,
  price,
  image,
  category,
  onClick,
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* Card Produk */}
      <div
        onClick={onClick}
        className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer border border-gray-100"
      >
        {/* Gambar produk */}
        <div className="relative w-full h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* ✅ Badge kategori di pojok kanan atas gambar */}
          {category && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-lg shadow">
              {category}
            </span>
          )}
        </div>

        {/* Detail produk */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{description}</p>

          {/* ✅ Baris bawah: harga kiri, ikon maximize kanan */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-blue-600 font-bold text-sm">
              Rp {Number(price).toLocaleString("id-ID")}
              <span className="text-gray-400 text-xs font-normal"> /portion</span>
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="bg-white p-1.5 rounded-md shadow hover:bg-gray-50 transition"
              title="Lihat gambar ukuran penuh"
            >
              <Maximize2 size={16} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={image}
              alt={title}
              className="w-full h-auto rounded-lg object-contain shadow-xl"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 bg-white text-gray-700 hover:bg-gray-200 rounded-full p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
