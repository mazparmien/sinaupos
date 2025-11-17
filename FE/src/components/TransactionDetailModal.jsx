import React from "react";
import { X } from "lucide-react";

export default function TransactionDetailModal({ open, onClose, transaction }) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative animate-fadeIn">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Judul */}
        <h2 className="text-xl font-semibold text-center mb-5">
          Transaction Detail
        </h2>

        {/* Isi Detail */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-3">
          <div>
            <p>
              <span className="font-medium text-gray-600">No Order:</span>{" "}
              <span className="font-semibold">{transaction.orderNo}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Order Date:</span>{" "}
              {transaction.orderDate}
            </p>
            <p>
              <span className="font-medium text-gray-600">Customer:</span>{" "}
              {transaction.customer}
            </p>
            <p>
              <span className="font-medium text-gray-600">Dine-in:</span> No. Meja 02
            </p>
          </div>

          <div className="border-t border-dashed border-gray-300 my-3"></div>

          <div className="flex justify-between font-medium">
            <span>{transaction.itemName || "Gado-gado Spesial"}</span>
            <span>Rp {Number(transaction.price || 20000).toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500">1 × Rp 20.000</p>

          <div className="border-t border-dashed border-gray-300 my-3"></div>

          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>Rp 20.000</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>Rp 5.000</span>
          </div>

          <div className="border-t border-dashed border-gray-300 my-3"></div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Rp 25.000</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Diterima</span>
            <span>Rp 50.000</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Kembalian</span>
            <span>Rp 25.000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
