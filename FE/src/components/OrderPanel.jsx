import { Bookmark, Trash2, Minus, Plus, Pencil } from "lucide-react";
import { useState } from "react";

export default function OrderPanel({
  cart = [],
  onRemove,
  onUpdateQty,
  onUpdateNote,
}) {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  // Order type: dinein or takeaway
  const [orderType, setOrderType] = useState("dinein");

  // Nominal pembayaran
  const [selectedNominal, setSelectedNominal] = useState("");
  const [manualNominal, setManualNominal] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal > 0 ? 5000 : 0;
  const total = subtotal + tax;

  const nominalOptions = [50000, 75000, 100000];

  return (
    <div className="w-[420px] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">List Order</h2>
            <p className="text-xs text-gray-500">
              No Order{" "}
              <span className="font-medium text-gray-700">ORDR#1234567890</span>
            </p>
          </div>
          <Bookmark
            className="text-gray-400 hover:text-blue-600 cursor-pointer"
            size={20}
          />
        </div>

        {/* Dine In / Take Away */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setOrderType("dinein")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              orderType === "dinein"
                ? "bg-blue-600 text-white shadow-md"
                : "border border-gray-300 text-gray-600 bg-white"
            }`}
          >
            Dine in
          </button>

          <button
            onClick={() => setOrderType("takeaway")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              orderType === "takeaway"
                ? "bg-blue-600 text-white shadow-md"
                : "border border-gray-300 text-gray-600 bg-white"
            }`}
          >
            Take Away
          </button>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Anisa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* No.Table HANYA tampil jika Dine In */}
          {orderType === "dinein" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                No.Table
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select</option>
                <option value="1">01</option>
                <option value="2">02</option>
              </select>
            </div>
          )}
        </div>

        {/* List Order */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  {/* Left */}
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-md object-cover"
                    />

                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingNoteId(item.id);
                            setNoteValue(item.note || "");
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Pencil size={14} />
                        </button>

                        {editingNoteId === item.id ? (
                          <input
                            value={noteValue}
                            autoFocus
                            onChange={(e) => setNoteValue(e.target.value)}
                            onBlur={() => {
                              onUpdateNote(item, noteValue);
                              setEditingNoteId(null);
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-xs text-gray-500 italic">
                            {item.note || "Without note"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQty(item, Math.max(1, item.qty - 1))
                        }
                        className="w-6 h-6 flex items-center justify-center border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-medium text-gray-800 text-sm">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => onUpdateQty(item, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm text-center py-12">
              No Menu Selected
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      {cart.length > 0 && (
        <div className="border-t bg-white p-5 shadow-inner">
          {/* Total */}
          <div className="text-sm text-gray-700 mb-4">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>

            <hr className="my-2 border-gray-300" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-blue-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Select Nominal BUTTONS */}
          <label className="block text-sm font-medium mb-2">Select Nominal</label>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {nominalOptions.map((n, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedNominal(n);
                  setManualNominal(n);
                }}
                className={`py-2 rounded-lg border text-sm font-medium transition ${
                  selectedNominal === n
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-600 hover:border-blue-400"
                }`}
              >
                Rp {n.toLocaleString("id-ID")}
              </button>
            ))}
          </div>

          {/* Input manual */}
          <label className="block text-sm font-medium mb-1">
            Enter Nominal Here
          </label>
          <input
            type="number"
            placeholder="e.g. 150000"
            value={manualNominal}
            onChange={(e) => {
              setManualNominal(e.target.value);
              setSelectedNominal("");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:outline-none mb-5"
          />

          {/* PAY button */}
          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md">
            Pay
          </button>
        </div>
      )}
    </div>
  );
}
