import React from "react";

export default function TransactionSuccessModal({
  open,
  onClose,
  transaction,
  paid,
  items
}) {
  if (!open || !transaction) return null;

  const kembalian = paid - transaction.total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded-2xl shadow-xl p-8 relative animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-6">
          Transaction Success
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          {/* HEADER INFO */}
          <p className="text-sm text-gray-600">
            No Order{" "}
            <span className="font-semibold">
              ORDR#{transaction.order_number}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Order Date{" "}
            <span className="font-semibold">
              {new Date(transaction.created_at).toLocaleString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Customer Name{" "}
            <span className="font-semibold">{transaction.customer_name}</span>
          </p>

          <p className="text-sm font-semibold text-gray-700 mt-2">
            {transaction.order_type === "take-away" ? "Take Away" : "Dine In"}
          </p>

          <hr className="my-3 border-dashed" />

          {/* ITEMS */}
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.qty} × Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>

              <p className="font-semibold">
                Rp {(item.qty * item.price).toLocaleString("id-ID")}
              </p>
            </div>
          ))}

          <hr className="my-3 border-dashed" />

          {/* TOTALS */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Sub Total</span>
            <span>Rp {transaction.subtotal.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tax</span>
            <span>Rp {transaction.tax.toLocaleString("id-ID")}</span>
          </div>

          <hr className="my-3 border-dashed" />

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span className="text-blue-600">
              Rp {transaction.total.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Diterima</span>
            <span>Rp {paid.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Kembalian</span>
            <span>Rp {kembalian.toLocaleString("id-ID")}</span>
          </div>

        </div>

        {/* PRINT BUTTON */}
        <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          Print Struk
        </button>
      </div>
    </div>
  );
}
