import React, { useState, useEffect, useRef } from "react";
import { Trash2, Edit3, Save, X, Upload } from "lucide-react";
import { apiFetch } from "../services/apiFetch";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProductPanel({ product, onClose, onRefresh }) {
  const isAddMode = !product;
  const [isEditing, setIsEditing] = useState(isAddMode);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // Populate form saat Edit / Detail
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        image: null,
      });
      if (product.image) {
        const imgUrl = product.image.startsWith("http")
          ? product.image
          : `${API_URL.replace("/api", "")}/uploads/${product.image}`;
        setPreview(imgUrl);
      }
    } else {
      setFormData({
        title: "",
        category: "",
        price: "",
        description: "",
        image: null,
      });
      setPreview(null);
    }
  }, [product]);

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File Upload
  const handleFile = (file) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Save Product
  const handleSave = async () => {
    try {
      const method = isAddMode ? "POST" : "PUT";
      const url = isAddMode ? "/products" : `/products/${product.id}`;
      const form = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          form.append(key, val instanceof File ? val : String(val));
        }
      });

      await apiFetch(url, { method, body: form });
      onRefresh();

      if (isAddMode) onClose();
      else setIsEditing(false);

      toast.success("Menu saved successfully!");
    } catch (err) {
      console.error("❌ Error saving:", err);
      toast.error("Failed to save product");
    }
  };

  // Delete Product
  const handleDelete = async () => {
    try {
      await apiFetch(`/products/${product.id}`, { method: "DELETE" });
      toast.success("Menu successfully deleted!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("❌ Error deleting:", err);
      toast.error("Failed to delete product");
    } finally {
      setShowConfirm(false);
    }
  };

  // Trigger file picker
  const triggerFilePicker = () => fileInputRef.current?.click();

  return (
    <>
      {/* Modal Konfirmasi Delete */}
      <ConfirmDeleteModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />

      {/* Panel Utama */}
      <aside className="w-[380px] border-l border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-base font-semibold text-gray-800">
            {isAddMode ? "Add Menu" : isEditing ? "Edit Menu" : "Detail Menu"}
          </h2>

          {!isAddMode && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}

          {!isAddMode && isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          )}

          {isAddMode && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex-1">
          {/* Upload area */}
          {isAddMode && (
            <label
              className="border border-dashed border-blue-300 rounded-md p-3 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition cursor-pointer mb-4"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-md"
                />
              ) : (
                <>
                  <Upload size={28} className="text-blue-500 mb-1" />
                  <p className="text-xs">
                    Drag & drop file here or{" "}
                    <span className="text-blue-600 font-medium">Choose File</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}

          {/* Detail / Edit Mode Image */}
          {!isAddMode && (
            <div className="mb-3 flex flex-col items-center">
              <img
                src={preview || "/assets/images/no-image.png"}
                alt="Product"
                className="w-full h-36 object-cover rounded-md border"
              />
              {isEditing && (
                <>
                  <button
                    onClick={triggerFilePicker}
                    className="mt-2 text-xs text-blue-600 font-medium border border-blue-500 rounded px-2 py-0.5 hover:bg-blue-50"
                  >
                    Change Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600">Name</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter name..."
                className="w-full border rounded-md px-2 py-1 mt-0.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border rounded-md px-2 py-1 mt-0.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select category</option>
                <option value="Foods">Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Price</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter price..."
                className="w-full border rounded-md px-2 py-1 mt-0.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Description
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Add description..."
                className="w-full border rounded-md px-2 py-1 mt-0.5 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-white">
          {(isAddMode || isEditing) && (
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition"
            >
              Save
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
