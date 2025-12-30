const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // IMPORTANTE: para cookies httpOnly (token)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || "Ocurrió un error.";
    throw new Error(msg);
  }

  return data;
}
