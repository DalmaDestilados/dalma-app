// URL base del backend
// Debe apuntar a /api
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

// Convierte la respuesta a JSON de forma segura
async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Respuesta inválida del servidor." };
  }
}

// Función general para hacer peticiones al backend
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  // Agregar token JWT si existe
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Verifica si se envía FormData
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // Si no es FormData, enviamos JSON
  if (!isFormData) {
    headers["Content-Type"] =
      headers["Content-Type"] || "application/json";
  }

  // Llamada al backend
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await safeJson(res);

  // Manejo de errores HTTP
  if (!res.ok) {
    const msg = data?.error || data?.message || "Ocurrió un error.";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
