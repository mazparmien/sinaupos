import { Bookmark, LogOut, UserCircle2, Archive } from "lucide-react";

export default function RightPanel() {
  return (
    <div className="w-[420px] bg-white flex flex-col border-l border-gray-200">

      {/* Header Atas */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        {/* Kiri */}
        <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600">
          <Archive size={18} />
          <span className="text-sm font-medium">Order Archive</span>
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-4">
          {/* Profil Kasir */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/image/cashier.jpg" // letakkan di public/assets/image/
              alt="Cashier"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                John Doe
              </p>
              <p className="text-xs text-gray-500">Cashier</p>
            </div>
          </div>

          {/* Tombol Logout */}
          <button className="p-2 rounded-lg hover:bg-red-50">
            <LogOut size={20} className="text-red-500" />
          </button>
        </div>
      </div>
      {/* Panel List Order */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header List Order */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">List Order</h2>
            <p className="text-sm text-gray-500">
              No Order{" "}
              <span className="font-medium text-gray-700">
                ORDR#1234567890
              </span>
            </p>
          </div>
          <Bookmark className="text-gray-400 hover:text-blue-600 cursor-pointer" size={20} />
        </div>

        {/* Dine In / Take Away */}
        <div className="flex gap-3 mb-5">
          <button className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-lg shadow-md">
            Dine in
          </button>
          <button className="flex-1 border border-gray-300 text-gray-500 font-medium py-3 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">
            Take Away
          </button>
        </div>

        {/* Form Customer */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              No.Table
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select No.Table</option>
              <option value="1">Table 1</option>
              <option value="2">Table 2</option>
            </select>
          </div>
        </div>

        {/* Garis pemisah */}
        <hr className="border-gray-200 mb-4" />

        {/* No Menu Selected */}
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No Menu Selected
        </div>

        {/* Tombol Pay */}
        <button
          disabled
          className="mt-4 bg-gray-300 text-white font-medium py-3 rounded-lg cursor-not-allowed"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
