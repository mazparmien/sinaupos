import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  ShoppingBag,
  CreditCard,
  Utensils,
  CupSoda,
  CakeSlice,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * AdminDashboard.jsx
 * - Fetch /api/transactions and /api/products
 * - Compute statistics for cards and weekly omzet chart
 * - Uses client-side aggregation (if dataset besar, prefer server-side endpoints)
 */

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]); // weekly data {day, Food, Beverage, Dessert}
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalOmzet: 0,
    allMenuOrders: 0,
    foods: 0,
    beverages: 0,
    desserts: 0,
  });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      const list = payload?.data || payload || [];
      const map = {};
      list.forEach((p) => {
        map[p.id] = p;
      });
      setProductsMap(map);
    } catch (err) {
      console.error("fetchProducts error:", err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      const list = payload?.data || payload || [];
      setTransactions(list);
    } catch (err) {
      console.error("fetchTransactions error:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate stats and chart after fetch
  useEffect(() => {
    (async () => {
      await fetchProducts();
      await fetchTransactions();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute stats & chart when transactions or productsMap change
  useEffect(() => {
    // stats
    const s = {
      totalOrders: transactions.length,
      totalOmzet: 0,
      allMenuOrders: 0,
      foods: 0,
      beverages: 0,
      desserts: 0,
    };

    // Prepare weekly aggregation (Mon..Sun)
    const weekOrder = {
      Mon: { Food: 0, Beverage: 0, Dessert: 0 },
      Tue: { Food: 0, Beverage: 0, Dessert: 0 },
      Wed: { Food: 0, Beverage: 0, Dessert: 0 },
      Thu: { Food: 0, Beverage: 0, Dessert: 0 },
      Fri: { Food: 0, Beverage: 0, Dessert: 0 },
      Sat: { Food: 0, Beverage: 0, Dessert: 0 },
      Sun: { Food: 0, Beverage: 0, Dessert: 0 },
    };

    transactions.forEach((t) => {
      // omzet: use t.total if available; fallback sum(items)
      let tSubtotal = 0;
      const items = t.items || [];
      items.forEach((it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.qty || 0);
        tSubtotal += price * qty;

        s.allMenuOrders += qty;

        const prod = productsMap[it.product_id];
        const category = (prod && prod.category) || (it.category || "");
        const catLower = String(category).toLowerCase();

        if (catLower.includes("food")) s.foods += qty;
        else if (catLower.includes("bever") || catLower.includes("drink")) s.beverages += qty;
        else if (catLower.includes("dessert") || catLower.includes("cake")) s.desserts += qty;

        // weekly omzet by category
        try {
          const date = new Date(t.created_at);
          const dayShort = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...
          const key = dayShort;
          if (key && weekOrder[key]) {
            if (catLower.includes("food")) weekOrder[key].Food += price * qty;
            else if (catLower.includes("bever") || catLower.includes("drink")) weekOrder[key].Beverage += price * qty;
            else if (catLower.includes("dessert") || catLower.includes("cake")) weekOrder[key].Dessert += price * qty;
          }
        } catch (e) {
          // ignore date parse error
        }
      });

      // prefer t.total if backend provides tax etc.
      s.totalOmzet += Number(t.total ?? tSubtotal);
    });

    // Build chart array in Mon..Sun order
    const orderDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const chartArr = orderDays.map((d) => ({
      day: d,
      Food: Math.round(weekOrder[d].Food),
      Beverage: Math.round(weekOrder[d].Beverage),
      Dessert: Math.round(weekOrder[d].Dessert),
    }));

    setStats(s);
    setChartData(chartArr);
  }, [transactions, productsMap]);

  // Helpers for display
  const formatCurrency = (v) =>
    `Rp ${Number(v || 0).toLocaleString("id-ID")}`;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Today, <span className="font-medium text-gray-700">{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <ShoppingBag size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">Total Orders</h3>
              <p className="text-lg font-semibold mt-1">{stats.totalOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <CreditCard size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">Total Omzet</h3>
              <p className="text-lg font-semibold mt-1">{formatCurrency(stats.totalOmzet)}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <Utensils size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">All Menu Orders</h3>
              <p className="text-lg font-semibold mt-1">{stats.allMenuOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                  <Utensils size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">Foods</h3>
              <p className="text-lg font-semibold mt-1">{stats.foods}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-400">
                  <CupSoda size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">Beverages</h3>
              <p className="text-lg font-semibold mt-1">{stats.beverages}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-300">
                  <CakeSlice size={22} />
                </div>
              </div>
              <h3 className="text-sm text-gray-500">Desserts</h3>
              <p className="text-lg font-semibold mt-1">{stats.desserts}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Omzet (Weekly)</h2>

              <div className="flex gap-3 text-sm">
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-400"
                />
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-400">
                  <option value="">All Category</option>
                  <option value="food">Food</option>
                  <option value="beverage">Beverage</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Food" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Beverage" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dessert" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
