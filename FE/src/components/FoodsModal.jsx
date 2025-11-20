import React, { useState } from "react";
import { X, Search } from "lucide-react";

export default function FoodsModal({ open, onClose, foods }) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = foods.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] max-h-[90vh] rounded-xl shadow-lg p-6 relative overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Foods</h2>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Enter the keyword here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={18}
            className="absolute right-3 top-2.5 text-gray-400"
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-3 py-2 text-left font-medium">Menu Name</th>
              <th className="px-3 py-2 text-left font-medium">Total Sales</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{item.title}</td>
                  <td className="px-3 py-2">{item.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="px-3 py-4 text-center text-gray-400 italic"
                >
                  No result found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
