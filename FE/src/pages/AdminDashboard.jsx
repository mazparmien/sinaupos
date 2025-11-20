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

// Universal modal (copy previously provided SalesCategoryModal.jsx to this path)
import SalesCategoryModal from "../components/SalesCategoryModal";

const AdminDashboard = () => {
  // Stats from backend
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalOmzet: 0,
    allMenuOrders: 0,
    foods: 0,
    beverages: 0,
    desserts: 0,
  });

  // Chart data (weekly)
  const [chartData, setChartData] = useState([]);

  // Modal states & data
  const [showFoods, setShowFoods] = useState(false);
  const [showBeverages, setShowBeverages] = useState(false);
  const [showDesserts, setShowDesserts] = useState(false);

  const [foodsData, setFoodsData] = useState([]);
  const [beveragesData, setBeveragesData] = useState([]);
  const [dessertsData, setDessertsData] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch dashboard summary from backend
  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports/dashboard", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      // if response is not JSON this will throw and go to catch
      const payload = await res.json();

      if (!payload || !payload.success) {
        console.error("Invalid dashboard payload", payload);
        return;
      }

      const d = payload.data || {};

      // set main stats (backend returns allMenu etc.)
      setStats({
        totalOrders: d.totalOrders ?? 0,
        totalOmzet: d.totalOmzet ?? 0,
        allMenuOrders: d.allMenu ?? 0,
        foods: d.foods ?? 0,
        beverages: d.beverages ?? 0,
        desserts: d.desserts ?? 0,
      });

      // weekly: expect array [{day: "Mon", food: 123, beverage: 45, dessert: 6}, ...]
      if (Array.isArray(d.weekly)) {
        const chart = d.weekly.map((w) => ({
          day: w.day,
          Food: Number(w.food ?? 0),
          Beverage: Number(w.beverage ?? 0),
          Dessert: Number(w.dessert ?? 0),
        }));
        setChartData(chart);
      } else {
        // fallback: if backend sends weekly with single "total" (older), map to Food only
        setChartData((d.weekly || []).map((w) => ({ day: w.day, Food: Number(w.total || 0), Beverage: 0, Dessert: 0 })));
      }

      // modal items (backend keys: foodItems, beverageItems, dessertItems)
      setFoodsData(Array.isArray(d.foodItems) ? d.foodItems.map(i => ({ title: i.title ?? i.name, total: i.total })) : []);
      setBeveragesData(Array.isArray(d.beverageItems) ? d.beverageItems.map(i => ({ title: i.title ?? i.name, total: i.total })) : []);
      setDessertsData(Array.isArray(d.dessertItems) ? d.dessertItems.map(i => ({ title: i.title ?? i.name, total: i.total })) : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // If you want periodic refresh, add interval here (optional)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (v) => `Rp ${Number(v || 0).toLocaleString("id-ID")}`;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Today,{" "}
              <span className="font-medium text-gray-700">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="p-2 rounded-lg bg-blue-50 inline-block">
                <ShoppingBag size={22} className="text-blue-600" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">Total Orders</h3>
              <p className="text-lg font-semibold mt-1">{stats.totalOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="p-2 rounded-lg bg-indigo-50 inline-block">
                <CreditCard size={22} className="text-indigo-600" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">Total Omzet</h3>
              <p className="text-lg font-semibold mt-1">{formatCurrency(stats.totalOmzet)}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="p-2 rounded-lg bg-green-50 inline-block">
                <Utensils size={22} className="text-green-600" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">All Menu Orders</h3>
              <p className="text-lg font-semibold mt-1">{stats.allMenuOrders}</p>
            </div>

            <div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer"
              onClick={() => setShowFoods(true)}
            >
              <div className="p-2 rounded-lg bg-blue-50 inline-block">
                <Utensils size={22} className="text-blue-500" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">Foods</h3>
              <p className="text-lg font-semibold mt-1">{stats.foods}</p>
            </div>

            <div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer"
              onClick={() => setShowBeverages(true)}
            >
              <div className="p-2 rounded-lg bg-blue-50 inline-block">
                <CupSoda size={22} className="text-blue-400" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">Beverages</h3>
              <p className="text-lg font-semibold mt-1">{stats.beverages}</p>
            </div>

            <div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer"
              onClick={() => setShowDesserts(true)}
            >
              <div className="p-2 rounded-lg bg-blue-50 inline-block">
                <CakeSlice size={22} className="text-blue-300" />
              </div>
              <h3 className="text-sm text-gray-500 mt-3">Desserts</h3>
              <p className="text-lg font-semibold mt-1">{stats.desserts}</p>
            </div>
          </div>

          {/* CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
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

      {/* Modals */}
      <SalesCategoryModal
        open={showFoods}
        onClose={() => setShowFoods(false)}
        title="Foods"
        items={foodsData}
      />

      <SalesCategoryModal
        open={showBeverages}
        onClose={() => setShowBeverages(false)}
        title="Beverages"
        items={beveragesData}
      />

      <SalesCategoryModal
        open={showDesserts}
        onClose={() => setShowDesserts(false)}
        title="Desserts"
        items={dessertsData}
      />
    </div>
  );
};

export default AdminDashboard;
