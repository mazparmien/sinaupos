import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Search,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransactionDetailModal from "../components/TransactionDetailModal";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    category: "",
    orderType: "",
  });

  const [page, setPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef(null);
  const perPage = 10;
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  // Dummy data sementara
  useEffect(() => {
    const data = Array(23)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        orderNo: `ORDR#${1234567890 + i}`,
        orderDate: "Rabu, 18/09/2024 12:30:00",
        orderType: "Dine-in",
        category: "Foods",
        customer: "Anisa",
      }));
    setSales(data);
    setLoading(false);
  }, []);

  // Tutup menu export jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("🔍 Filter:", filters);
  };

  const handleExport = (type) => {
    setShowExportMenu(false);
    console.log(`⬇️ Export ${type} clicked`);
  };

  // Pagination logic
  const totalPages = Math.ceil(sales.length / perPage);
  const paginatedData = sales.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Sales Report" />

        <main className="p-6 overflow-y-auto flex-1">
          {/* ===== Filter Section ===== */}
          <div className="bg-white rounded-xl ring-1 ring-gray-100 p-4 mb-5">
            <div className="flex items-end justify-between gap-4">
              {/* Filter Inputs */}
              <div className="grid grid-cols-4 gap-4 flex-1">
                {/* Start Date */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Start
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      name="start"
                      value={filters.start}
                      onChange={handleChange}
                      placeholder="Select date"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar
                      size={16}
                      className="absolute right-3 top-2.5 text-gray-400"
                    />
                  </div>
                </div>

                {/* Finish Date */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Finish
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      name="end"
                      value={filters.end}
                      onChange={handleChange}
                      placeholder="Select date"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar
                      size={16}
                      className="absolute right-3 top-2.5 text-gray-400"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Foods">Foods</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                {/* Order Type */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Order Type
                  </label>
                  <select
                    name="orderType"
                    value={filters.orderType}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select order type</option>
                    <option value="Dine-in">Dine-in</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-end gap-2 relative" ref={exportRef}>
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition"
                >
                  <Search size={16} /> Search
                </button>

                {/* Export Button */}
                <button
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="flex items-center justify-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-md px-3 py-2 transition"
                  title="Export data"
                >
                  <Download size={18} />
                </button>

                {/* Dropdown Menu */}
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-md shadow-md z-10 animate-fade-in">
                    <button
                      onClick={() => handleExport("Excel")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleExport("PDF")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== TABLE ===== */}
          <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="py-2.5 px-4 text-left font-medium">
                    No Order
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium">
                    Order Date
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium">
                    Order Type
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium">
                    Category
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium">
                    Customer Name
                  </th>
                  <th className="py-2.5 px-4 text-center font-medium">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-2.5 px-4">{s.orderNo}</td>
                      <td className="py-2.5 px-4">{s.orderDate}</td>
                      <td className="py-2.5 px-4">{s.orderType}</td>
                      <td className="py-2.5 px-4">{s.category}</td>
                      <td className="py-2.5 px-4">{s.customer}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleDetail(s)}
                        >
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* ===== Pagination ===== */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select className="border border-gray-200 rounded-md px-2 py-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>Entries</span>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-1 rounded-md ${
                    page === 1
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-2.5 py-1 rounded-md text-sm ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-1 rounded-md ${
                    page === totalPages
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          {/* ===== Transaction Detail Modal ===== */}
          <TransactionDetailModal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            transaction={selectedTransaction}
          />
        </main>
      </div>
    </div>
  );
}
