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
import FoodsModal from "../components/FoodsModal";
import BeveragesModal from "../components/BeveragesModal";
import DessertsModal from "../components/DessertsModal";

/**
 * SalesReport.jsx (Refactor Final)
 * - Uses TransactionItems.Product.category from backend
 * - Robust helpers and clear separation of concerns
 * - Dynamic Category dropdown (derived from products)
 * - Foods/Beverages/Desserts modals use Product.title & qty
 * - Client-side CSV export implemented
 *
 * Assumptions:
 * - GET /api/products -> { data: [...] } or [...]
 * - GET /api/transactions?start=..&end=..&category=..&order_type=.. -> { data: [...] }
 * - transactions[i].TransactionItems[*].Product exists and has { title, category }
 */

export default function SalesReport() {
  const [transactions, setTransactions] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // id -> product
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ start: "", end: "", category: "", orderType: "" });

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [showFoods, setShowFoods] = useState(false);
  const [foodsData, setFoodsData] = useState([]);
  const [showBeverages, setShowBeverages] = useState(false);
  const [beveragesData, setBeveragesData] = useState([]);
  const [showDesserts, setShowDesserts] = useState(false);
  const [dessertsData, setDessertsData] = useState([]);

  const token = localStorage.getItem("token");

  /* ---------------------- API Fetchers ---------------------- */
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return {};
      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : payload.data || [];
      const map = {};
      list.forEach((p) => {
        // store by id and also by uuid/title to help fallback lookups
        map[p.id] = p;
        if (p.uuid) map[`uuid:${p.uuid}`] = p;
        if (p.title) map[`title:${p.title}`] = p;
      });
      setProductsMap(map);
      return map;
    } catch (err) {
      console.error("fetchProducts error:", err);
      return {};
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.start) params.append("start", filters.start);
      if (filters.end) params.append("end", filters.end);
      if (filters.orderType) params.append("order_type", filters.orderType);
      if (filters.category) params.append("category", filters.category);

      const url = `http://localhost:5000/api/transactions?${params.toString()}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" },
      });
      const payload = await res.json();
      if (!res.ok) {
        console.error("fetchTransactions failed:", payload);
        alert(payload.message || "Gagal mengambil transaksi");
        setLoading(false);
        return;
      }
      const list = payload.data || [];
      setTransactions(list);
    } catch (err) {
      console.error("fetchTransactions error:", err);
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
      await fetchTransactions();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------- Helpers ---------------------- */
  // get unique categories from loaded products
  const productCategories = () => {
    const cats = new Set();
    Object.values(productsMap).forEach((p) => {
      if (p && p.category) cats.add(p.category);
    });
    return Array.from(cats);
  };

  // Safely extract TransactionItems array (supports both `TransactionItems` and `items` fallback)
  const getTransactionItems = (t) => t.TransactionItems || t.items || [];

  // Display category for transaction by aggregating product categories from items
  const getDisplayCategory = (t) => {
    const items = getTransactionItems(t);
    if (!items || items.length === 0) return "-";
    const cats = new Set();
    for (const it of items) {
      const cat = it.Product?.category || it.category || null;
      if (cat) cats.add(cat);
      else {
        // fallback lookup using product_id -> productsMap
        const pid = it.product_id ?? it.productId ?? it.id;
        if (pid !== undefined && pid !== null) {
          const prod = productsMap[pid] || productsMap[String(pid)];
          if (prod && prod.category) cats.add(prod.category);
        }
      }
    }
    return cats.size === 0 ? "-" : Array.from(cats).join(", ");
  };

  /* ---------------------- Stats computation ---------------------- */
  const computeStats = () => {
    const stats = { totalOrders: 0, totalOmzet: 0, allMenuSales: 0, foods: 0, beverages: 0, desserts: 0 };
    stats.totalOrders = transactions.length;
    stats.totalOmzet = transactions.reduce((s, t) => s + Number(t.total ?? 0), 0);

    transactions.forEach((t) => {
      const items = getTransactionItems(t);
      items.forEach((it) => {
        const qty = Number(it.qty || 0);
        stats.allMenuSales += qty;

        const category = (it.Product?.category || it.category || "").toLowerCase();
        if (category.includes("food")) stats.foods += qty;
        else if (category.includes("bever") || category.includes("drink")) stats.beverages += qty;
        else if (category.includes("dessert") || category.includes("cake")) stats.desserts += qty;
        else {
          // fallback: try lookup from productsMap
          const pid = it.product_id ?? it.productId ?? it.id;
          const prod = productsMap[pid] || productsMap[String(pid)];
          if (prod && prod.category) {
            const c = String(prod.category).toLowerCase();
            if (c.includes("food")) stats.foods += qty;
            else if (c.includes("bever") || c.includes("drink")) stats.beverages += qty;
            else if (c.includes("dessert") || c.includes("cake")) stats.desserts += qty;
          }
        }
      });
    });

    return stats;
  };

  const stats = computeStats();

  /* ---------------------- Pagination ---------------------- */
  const totalPages = Math.max(1, Math.ceil(transactions.length / perPage));
  const paginated = transactions.slice((page - 1) * perPage, page * perPage);

  /* ---------------------- UI Handlers ---------------------- */
  const handleDetail = (tx) => {
    setSelectedTransaction(tx);
    setShowDetail(true);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const handleExportCSV = () => {
    // export current paginated view to CSV
    const rows = [];
    const headers = ["order_number", "created_at", "order_type", "category", "customer_name", "total"];
    rows.push(headers.join(","));

    paginated.forEach((t) => {
      const row = [
        `"ORDR#${t.order_number}"`,
        `"${t.created_at}"`,
        `"${t.order_type}"`,
        `"${getDisplayCategory(t)}"`,
        `"${t.customer_name || "-"}"`,
        Number(t.total ?? 0),
      ];
      rows.push(row.join(","));
    });

    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    // simple approach: open print view of table
    // better PDF generation can be added server-side or with jsPDF
    window.print();
    setShowExportMenu(false);
  };

  // open category modals

  const openFoodsModal = () => {
  const map = {};

  transactions.forEach((t) => {
    getTransactionItems(t).forEach((it) => {
      const prod = it.Product;
      if (!prod) return;

      const cat = (prod.category || "").toLowerCase();
      if (!cat.includes("food")) return;

      const title = prod.title || "Unknown";
      map[title] = (map[title] || 0) + Number(it.qty || 0);
    });
  });

  const list = Object.keys(map).map((title) => ({
    title,
    total: map[title],
  }));

  setFoodsData(list);
  setShowFoods(true);
};


const openBeveragesModal = () => {
  const map = {};

  transactions.forEach((t) => {
    getTransactionItems(t).forEach((it) => {
      const prod = it.Product;
      if (!prod) return;

      const cat = (prod.category || "").toLowerCase();
      if (!cat.includes("bever"))  return;

      const title = prod.title || "Unknown";
      map[title] = (map[title] || 0) + Number(it.qty || 0);
    });
  });

  const list = Object.keys(map).map((title) => ({
    title,
    total: map[title],
  }));

  setBeveragesData(list);
  setShowBeverages(true);
};


const openDessertsModal = () => {
  const map = {};

  transactions.forEach((t) => {
    getTransactionItems(t).forEach((it) => {
      const prod = it.Product;
      if (!prod) return;

      const cat = (prod.category || "").toLowerCase();
      if (!cat.includes("dessert") && !cat.includes("cake")) return;

      const title = prod.title || "Unknown";
      map[title] = (map[title] || 0) + Number(it.qty || 0);
    });
  });

  const list = Object.keys(map).map((title) => ({
    name: title,
    total: map[title],
  }));

  setDessertsData(list);
  setShowDesserts(true);
};


  // close export dropdown when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Sales Report" />

        <main className="p-6 overflow-y-auto flex-1">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6 items-stretch">
            <div className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100">
              <div className="text-xs text-gray-500">Total Order</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.totalOrders}</div>
            </div>

            <div className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100">
              <div className="text-xs text-gray-500">Total Omzet</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">Rp {Number(stats.totalOmzet || 0).toLocaleString("id-ID")}</div>
            </div>

            <div className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100">
              <div className="text-xs text-gray-500">All Menu Sales</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.allMenuSales}</div>
            </div>

            <div onClick={openFoodsModal} className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <div className="text-xs text-gray-500">Foods</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.foods}</div>
            </div>

            <div onClick={openBeveragesModal} className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <div className="text-xs text-gray-500">Beverages</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.beverages}</div>
            </div>

            <div onClick={openDessertsModal} className="col-span-1 bg-white rounded-lg p-4 shadow-sm ring-1 ring-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <div className="text-xs text-gray-500">Desserts</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.desserts}</div>
            </div>
          </div>

          {/* FILTER AREA */}
          <div className="bg-white rounded-xl ring-1 ring-gray-100 p-4 mb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="grid grid-cols-4 gap-4 flex-1">
                <div>
                  <label className="text-xs font-medium text-gray-600">Start</label>
                  <div className="relative mt-1">
                    <input type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <Calendar size={16} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Finish</label>
                  <div className="relative mt-1">
                    <input type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <Calendar size={16} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Category</label>
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">All</option>
                    {productCategories().map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Order Type</label>
                  <select value={filters.orderType} onChange={(e) => setFilters({ ...filters, orderType: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">All</option>
                    <option value="dine-in">Dine-in</option>
                    <option value="take-away">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end gap-2 relative" ref={exportRef}>
                <button onClick={handleSearch} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm"><Search size={14} /> Search</button>

                <button onClick={() => setShowExportMenu((p) => !p)} className="ml-2 border border-gray-200 hover:bg-gray-50 rounded-md px-3 py-2"><Download size={16} /></button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-md shadow-md z-20">
                    <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Export CSV</button>
                    <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Print / PDF</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">No Order</th>
                  <th className="py-3 px-4 text-left">Order Date</th>
                  <th className="py-3 px-4 text-left">Order Type</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Customer Name</th>
                  <th className="py-3 px-4 text-center">Detail</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-6 text-gray-400">No data found</td></tr>
                ) : (
                  paginated.map((t) => {
                    const displayCategory = getDisplayCategory(t);
                    return (
                      <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-2.5 px-4">ORDR#{t.order_number}</td>
                        <td className="py-2.5 px-4">{new Date(t.created_at).toLocaleString("id-ID", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="py-2.5 px-4 capitalize">{t.order_type}</td>
                        <td className="py-2.5 px-4">{displayCategory}</td>
                        <td className="py-2.5 px-4">{t.customer_name || "-"}</td>
                        <td className="py-2.5 px-4 text-center"><button className="text-blue-600 hover:text-blue-800" onClick={() => handleDetail(t)}><ExternalLink size={16} /></button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={perPage} readOnly><option>10</option></select>
                <span>Entries</span>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`p-1 rounded-md ${page === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}><ChevronLeft size={18} /></button>
                {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setPage(i + 1)} className={`px-2.5 py-1 rounded-md text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{i + 1}</button>))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`p-1 rounded-md ${page === totalPages ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          {/* MODALS */}
          <TransactionDetailModal open={showDetail} onClose={() => setShowDetail(false)} transaction={selectedTransaction} />
          <FoodsModal open={showFoods} onClose={() => setShowFoods(false)} foods={foodsData} />
          <BeveragesModal open={showBeverages} onClose={() => setShowBeverages(false)} items={beveragesData} />
          <DessertsModal open={showDesserts} onClose={() => setShowDesserts(false)} items={dessertsData} />
        </main>
      </div>
    </div>
  );
}
