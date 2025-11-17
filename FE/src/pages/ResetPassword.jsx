import React, { useState } from "react";
import { apiFetch } from "../services/apiFetch";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiFetch("/users/forgot-password", {
        method: "POST",
        body: { email },
      });
      setMessage("Reset link has been sent to your email.");
    } catch (err) {
      setMessage(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
      bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/images/bg.png')",
      }}
    >
      {/* CARD */}
      <div className="w-[480px] bg-white rounded-3xl shadow-2xl p-10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#4C3BCF] to-[#3572EF] flex items-center justify-center text-white font-bold text-xl mr-2">
            P
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C3BCF] to-[#3572EF]">
            PadiPos
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Please enter your registered email here!
        </p>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-green-600 mb-3">{message}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all shadow 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
