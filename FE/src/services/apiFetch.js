const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const config = {
    method: options.method || "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }), // hanya untuk non-FormData
      ...options.headers,
    },
    body: isFormData
      ? options.body // biarkan FormData dikirim apa adanya
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
  };

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, config);
  } catch (err) {
    console.error("❌ Gagal menghubungi server:", err);
    throw new Error("Tidak dapat terhubung ke server API");
  }

  if (res.status === 401) {
    console.warn("🔐 Token invalid / expired. Silakan login ulang.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMsg);
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}
