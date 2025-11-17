import React from "react";
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

const AdminDashboard = () => {
  // 📊 Dummy data omzet mingguan
  const data = [
    { day: "Mon", Food: 120000, Beverage: 40000, Dessert: 10000 },
    { day: "Tue", Food: 80000, Beverage: 20000, Dessert: 5000 },
    { day: "Wed", Food: 250000, Beverage: 60000, Dessert: 15000 },
    { day: "Thu", Food: 150000, Beverage: 40000, Dessert: 12000 },
    { day: "Fri", Food: 180000, Beverage: 45000, Dessert: 10000 },
    { day: "Sat", Food: 130000, Beverage: 25000, Dessert: 8000 },
    { day: "Sun", Food: 170000, Beverage: 30000, Dessert: 9000 },
  ];

  // 📦 Statistik dashboard
  const stats = [
    { label: "Total Orders", value: "500", icon: <ShoppingBag size={22} />, color: "text-blue-600" },
    { label: "Total Omzet", value: "Rp 10.000.000", icon: <CreditCard size={22} />, color: "text-indigo-600" },
    { label: "All Menu Orders", value: "1000", icon: <Utensils size={22} />, color: "text-green-600" },
    { label: "Foods", value: "500", icon: <Utensils size={22} />, color: "text-blue-500" },
    { label: "Beverages", value: "300", icon: <CupSoda size={22} />, color: "text-blue-400" },
    { label: "Desserts", value: "200", icon: <CakeSlice size={22} />, color: "text-blue-300" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Konten dalam */}
        <div className="p-6 overflow-y-auto">
          {/* Judul dan tanggal */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Today, <span className="font-medium text-gray-700">Senin, 30 September 2024</span>
            </p>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-blue-50 ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-sm text-gray-500">{item.label}</h3>
                <p className="text-lg font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Omzet</h2>

              {/* Filter date & kategori */}
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
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}>
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
