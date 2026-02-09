import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function BartenderMe() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/bartenders/me");
        setPerfil(data);
      } catch (err) {
        // 401 = no es bartender
        // 404 = bartender sin perfil
        if (err.status === 401 || err.status === 404) {
          setPerfil(null);
        } else {
          console.error("Error cargando perfil bartender:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Cargando…</p>;
  }

  /* =========================
     NO TIENE PERFIL
  ========================= */
  if (!perfil) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>No tienes perfil de bartender</h2>
        <p>
          Crea tu perfil profesional para mostrar tus cócteles y tu experiencia.
        </p>

        <button
          onClick={() => navigate("/admin/bartenders")}
          style={{
            marginTop: 16,
            padding: "14px 24px",
            borderRadius: 999,
            border: "none",
            background: "#f28c28",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Crear mi perfil bartender
        </button>
      </div>
    );
  }

  /* =========================
     YA TIENE PERFIL
  ========================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>Mi perfil bartender</h2>

      <p>
        <strong>{perfil.nombre_publico}</strong>
      </p>

      <button
        onClick={() => navigate(`/bartenders/${perfil.id_bartender}`)}
        style={{
          marginTop: 12,
          padding: "10px 18px",
          borderRadius: 999,
          border: "none",
          background: "#eee",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Ver mi perfil público
      </button>

      <button
        onClick={() => navigate("/bartenders/me/edit")}
        style={{
          display: "block",
          marginTop: 12,
          padding: "12px 18px",
          borderRadius: 999,
          border: "none",
          background: "#f28c28",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Editar mi perfil
      </button>
    </div>
  );
}
