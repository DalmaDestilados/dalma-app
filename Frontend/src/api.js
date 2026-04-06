const API_BASE =
  import.meta.env.VITE_API_BASE

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Respuesta inválida del servidor." };
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  // SIEMPRE enviar Bearer token si existe
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // SOLO setear Content-Type si NO es FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const err = new Error(data?.message || "Error");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
