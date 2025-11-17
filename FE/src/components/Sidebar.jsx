import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ShoppingBag,
  ClipboardList,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function Sidebar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ambil path aktif dari router

  // 🔹 Ambil data user & role dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setRole(parsed.role || "guest");
      } catch (err) {
        console.error("❌ Gagal parsing user:", err);
      }
    }
  }, []);

  // 🔹 Menu dinamis berdasarkan role
  const menuItems =
    role === "admin"
      ? [
          {
            id: "dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={22} />,
            label: "Dashboard",
          },
          {
            id: "catalog",
            path: "/catalog",
            icon: <ShoppingBag size={22} />,
            label: "Catalog",
          },
          {
            id: "sales",
            path: "/sales",
            icon: <ClipboardList size={22} />,
            label: "Sales Report",
          },
          {
            id: "settings",
            path: "/settings",
            icon: <Settings size={22} />,
            label: "Settings",
          },
        ]
      : [
          {
            id: "dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={22} />,
            label: "Dashboard",
          },
          {
            id: "sales",
            path: "/sales",
            icon: <ClipboardList size={22} />,
            label: "Sales Report",
          },
          {
            id: "settings",
            path: "/settings",
            icon: <Settings size={22} />,
            label: "Settings",
          },
        ];

  // 🔐 Fungsi logout (pakai navigate biar tidak reload)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔄 Navigasi antar menu (React Router, tanpa reload)
  const handleNavigate = (item) => {
    navigate(item.path);
  };

  return (
    <aside className="w-[72px] h-screen bg-white border-r border-gray-200 flex flex-col items-center justify-between py-5 shadow-sm">
      {/* Bagian Atas */}
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow">
          P
        </div>

        <div className="w-8 border-t border-gray-200 my-2"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-8 h-8 flex items-center justify-center border border-blue-400 text-blue-500 rounded-full hover:bg-blue-50 transition"
          title="Logout"
        >
          <LogOut size={18} />
        </button>

        <div className="w-8 border-t border-gray-200 my-3"></div>

        {/* Menu Navigasi */}
        <nav className="flex flex-col gap-6 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path; // ✅ deteksi route aktif
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item)}
                className={`relative flex items-center justify-center text-gray-400 hover:text-blue-600 transition ${
                  isActive ? "text-blue-600" : ""
                }`}
                title={item.label}
              >
                {item.icon}
                {isActive && (
                  <span className="absolute right-[-13px] top-1/2 -translate-y-1/2 w-[4px] h-8 bg-blue-600 rounded-l-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role info */}
      <div className="text-[11px] text-gray-400 mb-2 font-medium tracking-wide">
        {role ? role.toUpperCase() : "GUEST"}
      </div>
    </aside>
  );
}
