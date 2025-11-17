import { Archive, LogOut, Search } from "lucide-react";
import { logout } from "../services/authService";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Kiri: Pencarian */}
      <div className="flex items-center w-[500px] bg-gray-100 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Enter the keyword here..."
          className="bg-transparent focus:outline-none text-sm text-gray-700 w-full"
        />
      </div>

      {/* Kanan: Order Archive, Profil, Logout */}
      <div className="flex items-center gap-6">
        {/* Order Archive */}
        <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600">
          <Archive size={18} />
          <span className="text-sm font-medium">Order Archive</span>
        </div>

        {/* Profil Kasir */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/john.png" // letakkan di public/assets/image/
            alt="Cashier"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-800">John Doe</p>
            <p className="text-xs text-gray-500">Cashier</p>
          </div>
        </div>

        {/* Tombol Logout */}
        <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 transition">
          <LogOut size={20} className="text-red-500" />
        </button>
      </div>
    </header>
  );
}
