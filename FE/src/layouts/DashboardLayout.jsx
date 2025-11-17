import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

/**
 * Layout utama yang digunakan oleh semua role.
 * Admin dan Cashier pakai layout yang sama tapi beda konten berdasarkan role.
 */
export default function DashboardLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "guest";

  // POS (kasir) butuh tampilan full screen tanpa header
  const isCashier = role === "cashier";
  const isKasirDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar umum */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header tampil hanya untuk Admin, tidak untuk POS kasir */}
        {!isCashier || !isKasirDashboard ? <Header /> : null}

        {/* Isi halaman */}
        <main
          className={`flex-1 overflow-y-auto ${
            isCashier && isKasirDashboard ? "p-0" : "p-6"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
