import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

/* FALLBACKS */
import avatarFallback from "../assets/Masters/MaestroDestilador.jpg";
import eventoImg from "../assets/Evento/Evento.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function BartenderDetail() {
  const { bartenderId } = useParams();
  const navigate = useNavigate();

  const [bartender, setBartender] = useState(null);
  const [cocteles, setCocteles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     UTIL IMAGEN
  ========================= */
  function getImageUrl(path) {
    if (!path) return null;
    return `${API_BASE}/${path.replace(/^\/+/, "")}`;
  }

  /* =========================
     FETCH PERFIL PUBLICO
  ========================= */
  useEffect(() => {
    async function fetchBartender() {
      try {
        const res = await fetch(
          `${API_BASE}/api/bartenders/public/${bartenderId}`
        );

        if (!res.ok) {
          navigate("/bartenders", { replace: true });
          return;
        }

        const data = await res.json();
        setBartender(data);
        setCocteles([]);
      } catch (err) {
        console.error(err);
        navigate("/bartenders", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    fetchBartender();
  }, [bartenderId, navigate]);

  /* =========================
     LOADING
  ========================= */
  if (loading) return <div className="pd-loading">Cargando…</div>;
  if (!bartender) return null;

  const heroStyle = bartender.banner_perfil
    ? { backgroundImage: `url(${getImageUrl(bartender.banner_perfil)})` }
    : {
        background: "linear-gradient(135deg, #f28c28 0%, #f6b37f 100%)",
      };

  return (
    <div className="pd-wrap">
      {/* HERO */}
      <div className="pd-hero" style={heroStyle}>
        <button className="pd-back" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <h1 className="pd-title">
        {bartender.nombre_publico || "Bartender"}
      </h1>

      {/* UBICACIÓN */}
      {(bartender.ciudad || bartender.region) && (
        <div className="pd-pill">
          {[bartender.ciudad, bartender.region].filter(Boolean).join(", ")}
        </div>
      )}

      {/* 👉 ESPECIALIDAD (DESTACADA) */}
      {bartender.especialidad && (
        <div className="pd-pill pd-pill-special">
          🍸 {bartender.especialidad}
        </div>
      )}

      {/* =========================
         SOBRE MI
      ========================= */}
      <section className="pd-section">
        <h2>Sobre mí</h2>

        <div className="pd-about">
          <p>
            {bartender.descripcion ||
              "Bartender apasionado por la coctelería y la creación de experiencias."}
          </p>

          <div className="pd-master">
            <img
              src={
                bartender.foto_perfil
                  ? getImageUrl(bartender.foto_perfil)
                  : avatarFallback
              }
              onError={(e) => (e.currentTarget.src = avatarFallback)}
              alt={bartender.nombre_publico}
            />
            <div>
              <strong>{bartender.nombre_publico}</strong>
              <div className="pd-specialidad-text">
                {bartender.especialidad || "Bartender profesional"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         CÓCTELES
      ========================= */}
      <section className="pd-section">
        <h2>Cócteles creados</h2>

        {cocteles.length === 0 && (
          <p className="pd-empty">
            Este bartender aún no ha publicado cócteles.
          </p>
        )}

        <div className="pd-products-grid">
          {cocteles.map((c) => (
            <div
              key={c.id_coctel}
              className="pd-product-card"
              onClick={() => navigate(`/cocteles/${c.id_coctel}`)}
            >
              <img
                src={c.imagen_url ? getImageUrl(c.imagen_url) : eventoImg}
                onError={(e) => (e.currentTarget.src = eventoImg)}
                alt={c.nombre}
              />
              <h3>{c.nombre}</h3>
              <p>{c.destilado_principal}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
         CONTACTO
      ========================= */}
      <section className="pd-section">
        <h2>Contacto</h2>

        <div className="pd-contact-icons">
          {bartender.email_contacto && (
            <a href={`mailto:${bartender.email_contacto}`}>✉️</a>
          )}
          {bartender.instagram && (
            <a
              href={`https://instagram.com/${bartender.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              📸
            </a>
          )}
        </div>
      </section>

      <Link to="/bartenders" className="pd-back-link">
        ← Volver a bartenders
      </Link>

      {/* ================= CSS ================= */}
      <style>{`
        .pd-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding-bottom: 90px;
        }
        .pd-loading {
          padding: 20px;
        }
        .pd-hero {
          height: 220px;
          background-size: cover;
          background-position: center;
          border-radius: 0 0 24px 24px;
          position: relative;
        }
        .pd-back {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #fff;
          font-size: 20px;
        }
        .pd-title {
          text-align: center;
          color: #f28c28;
          margin: 16px 0 6px;
          font-weight: 900;
        }
        .pd-pill {
          background: #fde9d8;
          margin: 6px auto;
          padding: 8px 14px;
          border-radius: 999px;
          width: fit-content;
          font-weight: 800;
          font-size: 13px;
        }
        .pd-pill-special {
          background: #f28c28;
          color: #111;
        }
        .pd-section {
          padding: 22px 14px;
          border-top: 1px solid #eee;
        }
        .pd-section h2 {
          text-align: center;
          color: #f28c28;
          margin-bottom: 14px;
        }
        .pd-about {
          display: grid;
          grid-template-columns: 1fr 120px;
          gap: 12px;
        }
        .pd-master img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 12px;
        }
        .pd-specialidad-text {
          font-size: 13px;
          font-weight: 800;
          color: #555;
        }
        .pd-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pd-product-card {
          background: #fff;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          cursor: pointer;
          text-align: center;
        }
        .pd-product-card img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 8px;
        }
        .pd-product-card h3 {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .pd-product-card p {
          font-size: 12px;
          color: #555;
        }
        .pd-contact-icons {
          display: flex;
          justify-content: center;
          gap: 18px;
          font-size: 22px;
        }
        .pd-back-link {
          display: block;
          text-align: center;
          margin: 20px 0;
          font-weight: 800;
        }
        .pd-empty {
          text-align: center;
          font-size: 13px;
          color: #777;
        }
      `}</style>
    </div>
  );
}
