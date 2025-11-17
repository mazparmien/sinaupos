import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Jika tidak ada token → redirect login
  if (!token) return <Navigate to="/login" replace />;

  // Jika token ada tapi role belum kebaca → jangan redirect dulu
  if (!user) return <div className="p-10 text-gray-500">Loading...</div>;

  return children;
};

export default ProtectedRoute;
