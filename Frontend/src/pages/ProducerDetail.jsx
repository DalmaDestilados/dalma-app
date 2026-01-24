import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

/* ========= HERO ========= */
import hero1 from "../assets/Hero/Destileria1.jpg";
import hero2 from "../assets/Hero/Destileria2.jpg";
import hero3 from "../assets/Hero/Destileria3.jpg";

/* ========= MASTER ========= */
import masterImg from "../assets/Masters/MaestroDestilador.jpg";

/* ========= PRODUCTOS ========= */
import ginImg from "../assets/Productos/Gin.jpg";
import piscoImg from "../assets/Productos/Pisco.jpg";
import ronImg from "../assets/Productos/Ron.jpg";
import tequilaImg from "../assets/Productos/Tequila.jpg";
import vodkaImg from "../assets/Productos/Vodka.jpg";
import whiskyImg from "../assets/Productos/Whisky.jpg";

/* ========= CÓCTELES ========= */
import c1 from "../assets/Cocteles/Coctel1.jpg";
import c2 from "../assets/Cocteles/Coctel2.jpg";
import c3 from "../assets/Cocteles/Coctel3.jpg";
import c4 from "../assets/Cocteles/Coctel4.jpg";
import c5 from "../assets/Cocteles/Coctel5.jpg";
import c6 from "../assets/Cocteles/Coctel6.jpg";

/* ========= EVENTO ========= */
import eventoImg from "../assets/Evento/Evento.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ProducerDetail() {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [slide, setSlide] = useState(0);

  const heroImages = [hero1, hero2, hero3];

  useEffect(() => {
    async function fetchProducer() {
      try {
        const res = await fetch(
          `${API_BASE}/api/destilerias/${producerId}/perfil`
        );

        if (!res.ok) {
          navigate("/productores", { replace: true });
          return;
        }

        const data = await res.json();

        setProducer({
          name: data.nombre_comercial,
          description: data.descripcion,
          logo: data.logo_url,
          persona: data.persona,
          galeria: data.galeria || [],

          // ✅ USA LO QUE VIENE DEL CRUD
          address:
            [data.ciudad, data.pais].filter(Boolean).join(", ") ||
            "Ubicación no especificada",

          

          hasShop: false,
          hasTours: false,
        });
      } catch (err) {
        console.error(err);
        navigate("/productores", { replace: true });
      }
    }

    fetchProducer();
  }, [producerId, navigate]);

  if (!producer) return <div className="pd-loading">Cargando…</div>;

  const next = () => setSlide((s) => (s + 1) % heroImages.length);
  const prev = () =>
    setSlide((s) => (s - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="pd-wrap">
      {/* HERO */}
      <div
        className="pd-hero"
        style={{ backgroundImage: `url(${heroImages[slide]})` }}
      >
        <button className="pd-back" onClick={() => navigate(-1)}>←</button>
        <button className="pd-nav left" onClick={prev}>‹</button>
        <button className="pd-nav right" onClick={next}>›</button>
      </div>

      {/* INFO */}
      <h1 className="pd-title">{producer.name}</h1>

      {producer.address && <div className="pd-pill">{producer.address}</div>}
      {producer.region && <div className="pd-pill">{producer.region}</div>}

      {/* CONÓCENOS */}
      <section className="pd-section">
        <h2>Conócenos</h2>

        <div className="pd-about">
          <p>{producer.description}</p>

          <div className="pd-master">
            <img
              src={producer.persona?.imagen_url || masterImg}
              alt="Maestro Destilador"
            />
            <div>
              <strong>{producer.persona?.nombre || "Maestro Destilador"}</strong>
              <div>{producer.persona?.descripcion || "Destilería"}</div>
            </div>
          </div>
        </div>

        <div className="pd-icons">
          <div>🛒 Punto de venta</div>
          <div>📍 Visitas guiadas</div>
          <div>🕒 Lun a Vie 10:00 – 18:00</div>
        </div>
      </section>

      {/* DESTILADOS */}
      <section className="pd-section">
        <h2>Nuestros destilados</h2>

        <div className="pd-grid">
          {[piscoImg, ginImg, ronImg, tequilaImg, vodkaImg, whiskyImg].map(
            (img, i) => (
              <div key={i} className="pd-card">
                <img src={img} alt="Producto" />
                <div className="pd-name">Destilado</div>
                <div className="pd-meta">700 cc</div>
                <div className="pd-meta">40% abv</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* EVENTO */}
      <section className="pd-section">
        <img className="pd-event" src={eventoImg} alt="Evento" />
        <div className="pd-event-label">
          Comparte en nuestros eventos y degustaciones
        </div>
      </section>

      {/* CÓCTELES */}
      <section className="pd-section">
        <h2>Cócteles recomendados</h2>

        <div className="pd-grid">
          {[c1, c2, c3, c4, c5, c6].map((img, i) => (
            <div key={i} className="pd-card">
              <img src={img} alt="Cóctel" />
              <div className="pd-name">Cóctel</div>
              <span className="pd-tag">Especial</span>
            </div>
          ))}
        </div>
      </section>

      <Link to="/productores" className="pd-back-link">
        ← Volver a destilerías
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
          background: #f6b37f;
          font-size: 20px;
        }

        .pd-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
        }

        .pd-nav.left { left: 10px; }
        .pd-nav.right { right: 10px; }

        .pd-title {
          text-align: center;
          color: #f28c28;
          margin: 16px 0 6px;
        }

        .pd-pill {
          background: #fde9d8;
          margin: 6px auto;
          padding: 8px 14px;
          border-radius: 10px;
          width: fit-content;
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

        .pd-icons div {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .pd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .pd-card img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 12px;
        }

        .pd-name {
          text-align: center;
          font-weight: 700;
          color: #f28c28;
          margin-top: 6px;
          font-size: 13px;
        }

        .pd-meta {
          text-align: center;
          font-size: 12px;
        }

        .pd-event {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 16px;
        }

        .pd-event-label {
          text-align: center;
          font-weight: 700;
          margin-top: 6px;
        }

        .pd-tag {
          display: block;
          text-align: center;
          background: #f6b37f;
          border-radius: 6px;
          margin-top: 6px;
          padding: 2px 0;
          font-size: 12px;
        }

        .pd-back-link {
          display: block;
          text-align: center;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}
