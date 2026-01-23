const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Respuesta inválida del servidor." };
  }
}

export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", 
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || "Ocurrió un error.";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
