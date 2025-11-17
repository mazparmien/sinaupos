import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import KasirDashboard from "./pages/KasirDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Catalog from "./pages/Catalog";
import SalesReport from "./pages/SalesReport";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";  
import { Toaster } from "react-hot-toast";

function App() {
  // Ambil role user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "guest";

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Role-based dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {role === "admin" ? <AdminDashboard /> : <KasirDashboard />}
            </ProtectedRoute>
          }
        />

        {/* Admin-only pages */}
        {role === "admin" && (
          <>
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <Catalog />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Shared pages (both admin & cashier) */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Fallback kalau URL tidak cocok */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
