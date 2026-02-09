import { useEffect, useState } from "react";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const avatarFallback = "/avatar-placeholder.png"; // o la imagen que ya uses

export default function AdminBartendersList() {
  const [bartenders, setBartenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ADMIN (BACKEND AUTH)
  // =========================
  useEffect(() => {
    apiFetch("/bartenders/admin")
      .then((data) => {
        const normalizados = data.map((b) => ({
          ...b,
          activo: b.activo === 1,
        }));
        setBartenders(normalizados);
      })
      .catch(() => setError("No autorizado"))
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // ACTIONS
  // =========================
  async function toggleEstado(b) {
    const nuevoEstado = b.activo ? 0 : 1;

    try {
      await apiFetch(`/bartenders/${b.id_bartender}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      setBartenders((prev) =>
        prev.map((x) =>
          x.id_bartender === b.id_bartender
            ? { ...x, activo: nuevoEstado === 1 }
            : x
        )
      );
    } catch {
      alert("No se pudo cambiar el estado");
    }
  }

  // =========================
  // RENDER STATES
  // =========================
  if (loading) return <p>Cargando bartenders...</p>;
  if (error) return <p>{error}</p>;

  // =========================
  // RENDER
  // =========================
  return (
    <div style={{ padding: 16 }}>
      <h2>Administrar Bartenders</h2>

      {bartenders.length === 0 && (
        <p>No hay bartenders registrados</p>
      )}

      {bartenders.map((b) => (
        <div
          key={b.id_bartender}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 14,
            background: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            opacity: b.activo ? 1 : 0.5,
          }}
        >
          {/* IMAGEN */}
          <img
            src={
              b.foto_perfil
                ? `${API_BASE}${b.foto_perfil}`
                : avatarFallback
            }
            alt={b.nombre_publico}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          />

          {/* INFO */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900 }}>
              🍸 {b.nombre_publico}
            </div>
            {!b.activo && (
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Desactivado
              </div>
            )}
          </div>

          {/* BOTÓN */}
          <button
            onClick={() => toggleEstado(b)}
            style={{
              background: b.activo ? "#e74c3c" : "#2ecc71",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {b.activo ? "Desactivar" : "Activar"}
          </button>
        </div>
      ))}
    </div>
  );
}
