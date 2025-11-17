import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { login } from "../services/authService";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(username, password);
      console.log("✅ Login sukses:", res);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Login gagal:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('/assets/images/bg.png')] bg-cover bg-center">
      <div className="w-[600px] h-[644px] bg-white rounded-2xl shadow-lg p-10 flex flex-col justify-center backdrop-blur-sm">
        {/* 🟣 LOGO HEADER */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#4C3BCF] to-[#3572EF] flex items-center justify-center text-white font-bold text-xl mr-2">
            P
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C3BCF] to-[#3572EF]">
            PadiPos
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Please enter your username and password here!
        </p>

        {error && (
          <p className="text-red-500 bg-red-100 text-sm text-center py-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              // className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                // className="w-full px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mt-1">
              <a href="/forgot-password" className="text-sm text-gray-500 hover:text-blue-600">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white font-semibold transition-all shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
