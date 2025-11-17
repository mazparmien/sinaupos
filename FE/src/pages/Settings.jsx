import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiFetch } from "../services/apiFetch";

const Settings = () => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    role: "",
    status: "Active",
    language: "English",
    image: null,
  });

  const [appearance, setAppearance] = useState({
    mode: "Light Mode",
    fontSize: "16 px",
    zoom: "100 (Normal)",
  });

  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔹 Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        email: parsed.email || "",
        username: parsed.name || "",
        role: parsed.role || "User",
        status: "Active",
        language: "English",
        image: parsed.image || null,
      });
      setPreview(parsed.image || null);
    }
  }, []);

  // 🔹 Upload foto profil ke backend
  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success && data.url) {
        setUser((prev) => ({ ...prev, image: data.url }));
        setPreview(data.url);

        // Update user di localStorage juga
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.image = data.url;
        localStorage.setItem("user", JSON.stringify(storedUser));

        alert("✅ Foto berhasil diupload!");
      } else {
        throw new Error(data.message || "Upload gagal");
      }
    } catch (err) {
      alert("❌ Gagal upload foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Hapus foto profil
  const handleDeletePicture = async () => {
    if (!window.confirm("Yakin ingin hapus foto profil?")) return;

    try {
      setUser((prev) => ({ ...prev, image: null }));
      setPreview(null);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      delete storedUser.image;
      localStorage.setItem("user", JSON.stringify(storedUser));

      alert("🗑️ Foto berhasil dihapus!");
    } catch (err) {
      console.error("Error delete picture:", err);
    }
  };

  // 🔹 Simpan perubahan tampilan
  const handleSave = () => {
    alert("✅ Pengaturan berhasil disimpan!");
  };

  // 🔹 Ganti password
  const handleChangePassword = () => {
    if (!password) return alert("Masukkan password baru!");
    alert("🔒 Password berhasil diubah!");
    setPassword("");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Settings</h1>

          {/* Account Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Account</h2>

            <div className="flex items-center gap-6 mb-6">
              <img
                src={preview || "/assets/images/profile.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-gray-200"
              />

              <div className="flex gap-3">
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                  {uploading ? "Uploading..." : "Change Picture"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files[0])}
                    disabled={uploading}
                  />
                </label>

                <button
                  onClick={handleDeletePicture}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Delete Picture
                </button>
              </div>
            </div>

            {/* Form Account */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <input
                  type="text"
                  value={user.username}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <input
                  type="text"
                  value={user.status}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Language</label>
                <select
                  value={user.language}
                  onChange={(e) =>
                    setUser({ ...user, language: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option>English</option>
                  <option>Indonesian</option>
                </select>
              </div>
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Password</h2>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="text-sm text-gray-500">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500">Preference Mode</label>
                <select
                  value={appearance.mode}
                  onChange={(e) =>
                    setAppearance({ ...appearance, mode: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Font Size</label>
                <select
                  value={appearance.fontSize}
                  onChange={(e) =>
                    setAppearance({ ...appearance, fontSize: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option>14 px</option>
                  <option>16 px</option>
                  <option>18 px</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Zoom Display</label>
                <select
                  value={appearance.zoom}
                  onChange={(e) =>
                    setAppearance({ ...appearance, zoom: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option>90 (Small)</option>
                  <option>100 (Normal)</option>
                  <option>110 (Large)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium text-sm"
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
