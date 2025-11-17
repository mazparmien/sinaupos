const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.isFormData;

  const config = {
    method: options.method || "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(`${API_URL}${path}`, config);
  if (!res.ok) {
    let errorMsg = "Terjadi kesalahan pada server";
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}
