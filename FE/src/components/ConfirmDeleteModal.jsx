import React from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[320px] p-6 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center bg-red-50 rounded-full">
            <Trash2 className="text-red-500" size={32} />
          </div>
        </div>

        <h2 className="text-gray-800 font-medium mb-6">
          Are you sure want to delete this file?
        </h2>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
