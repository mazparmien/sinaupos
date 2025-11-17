import { apiFetch } from "./apiFetch";

/**
 * 🔐 Login user (pakai name & password)
 */
export async function login(name, password) {
  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: { name, password }, // ✅ pakai name, bukan email
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    }

    return res;
  } catch (err) {
    throw new Error(err.message || "Gagal login");
  }
}

/**
 * 🚪 Logout user
 */
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
