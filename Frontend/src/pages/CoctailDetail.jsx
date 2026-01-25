import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ===== IMAGEN LOCAL DEL CÓCTEL (FALLBACK) ===== */
import coctelImg from "../assets/Cocteles/Coctel1.jpg";

const API_BASE = "http://localhost:3001";

export default function CoctelDetail() {
  const { cocktailId } = useParams(); // ✅ FIX
  const navigate = useNavigate();

  const [coctel, setCoctel] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     🔥 FIX IMAGEN (IGUAL AL LIST)
  ========================= */
  function getImageUrl(path) {
    if (!path) return null;
    return `${API_BASE}/${path.replace(/^\/+/, "").replace(/\\/g, "/")}`;
  }

  useEffect(() => {
    fetch(`${API_BASE}/api/cocteles/public/${cocktailId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar cóctel");
        return res.json();
      })
      .then((data) => setCoctel(data))
      .catch(() => setCoctel(null))
      .finally(() => setLoading(false));
  }, [cocktailId]);

  /* =========================
     🔥 FIX INGREDIENTES
     - ARRAY → OK
     - STRING (GROUP_CONCAT) → OK
  ========================= */
  const ingredientesNormalizados = useMemo(() => {
    if (!coctel?.ingredientes) return [];

    // Caso 1: vienen como array [{ ingrediente, cantidad }]
    if (Array.isArray(coctel.ingredientes)) {
      return coctel.ingredientes;
    }

    // Caso 2: vienen como string "Limón, Azúcar, Hielo"
    if (typeof coctel.ingredientes === "string") {
      return coctel.ingredientes
        .split(",")
        .map((i) => ({
          ingrediente: i.trim(),
          cantidad: null,
        }));
    }

    return [];
  }, [coctel]);

  if (loading) return <p style={{ padding: 20 }}>Cargando…</p>;
  if (!coctel) return <p style={{ padding: 20 }}>Cóctel no encontrado</p>;

  return (
    <div className="cd-wrap">
      {/* VOLVER */}
      <button className="cd-back" onClick={() => navigate(-1)}>←</button>

      {/* NOMBRE */}
      <div className="cd-title">
        {coctel.nombre}
      </div>

      {/* IMAGEN */}
      <div className="cd-image">
        <img
          src={
            coctel.imagen_url
              ? getImageUrl(coctel.imagen_url)
              : coctelImg
          }
          alt={coctel.nombre}
        />

        <button className="cd-fav">
          🔖<br />Agregar a<br />favoritos
        </button>
      </div>

      {/* INGREDIENTES */}
      <section className="cd-section">
        <h3>Ingredientes</h3>

        <div className="cd-ingredients">
          {ingredientesNormalizados.map((i, idx) => (
            <div key={idx}>
              <strong>{i.ingrediente}</strong>
              {i.cantidad && <div>{i.cantidad}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* PREPARACIÓN */}
      <section className="cd-prep">
        <h3>Preparación</h3>
        <p>
          {coctel.descripcion ||
            "Agregar los ingredientes en una coctelera con hielo, agitar y servir frío."}
        </p>
      </section>

      {/* MARCA / PRODUCTO */}
      <section
        className="cd-brand"
        onClick={() => navigate("/productos")}
      >
        <div className="cd-brand-logo">
          {coctel.destilado_principal?.toUpperCase() || "PISCO"}
        </div>

        <div className="cd-brand-info">
          <strong>{coctel.destilado_principal || "Nombre de marca"}</strong>
          <span>Ver perfil</span>
        </div>

        <div className="cd-brand-arrow">→</div>
      </section>

      {/* ===== ESTILOS ===== */}
      <style>{`
        .cd-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding-bottom: 90px;
          background: #fff;
        }

        .cd-back {
          position: fixed;
          top: 70px;
          left: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #f6b37f;
          font-size: 18px;
          z-index: 10;
        }

        .cd-title {
          margin: 16px;
          padding: 12px;
          background: #000;
          color: #f28c28;
          text-align: center;
          font-weight: 800;
          border-radius: 8px;
        }

        .cd-image {
          position: relative;
          margin: 0 16px 20px;
          border-radius: 14px;
          overflow: hidden;
        }

        .cd-image img {
          width: 100%;
          display: block;
        }

        .cd-fav {
          position: absolute;
          right: 12px;
          top: 12px;
          background: #fff;
          border: none;
          border-radius: 10px;
          padding: 8px;
          font-size: 11px;
          box-shadow: 0 4px 12px rgba(0,0,0,.25);
        }

        .cd-section {
          padding: 16px;
        }

        .cd-section h3 {
          color: #f28c28;
          margin-bottom: 12px;
        }

        .cd-ingredients {
          background: #fde0c8;
          padding: 16px;
          border-radius: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          text-align: center;
        }

        .cd-prep {
          padding: 16px;
          background: #fff6ef;
        }

        .cd-prep h3 {
          color: #f28c28;
          margin-bottom: 10px;
        }

        .cd-brand {
          display: grid;
          grid-template-columns: 80px 1fr 30px;
          align-items: center;
          gap: 12px;
          padding: 20px 16px;
          cursor: pointer;
        }

        .cd-brand-logo {
          background: #000;
          color: #fff;
          text-align: center;
          padding: 10px;
          font-weight: 800;
          font-size: 12px;
        }

        .cd-brand-info strong {
          color: #f28c28;
          display: block;
        }

        .cd-brand-info span {
          font-size: 13px;
          color: #444;
        }

        .cd-brand-arrow {
          font-size: 22px;
          color: #f28c28;
        }
      `}</style>
    </div>
  );
}
