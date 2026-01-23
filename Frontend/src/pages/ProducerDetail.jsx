import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

/* ========= EVENTO ========= */
import eventoImg from "../assets/Evento/Evento.jpg";

/* ========= CÓCTELES (mock temporal) ========= */
import c1 from "../assets/Cocteles/Coctel1.jpg";
import c2 from "../assets/Cocteles/Coctel2.jpg";
import c3 from "../assets/Cocteles/Coctel3.jpg";
import c4 from "../assets/Cocteles/Coctel4.jpg";
import c5 from "../assets/Cocteles/Coctel5.jpg";
import c6 from "../assets/Cocteles/Coctel6.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ProducerDetail() {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
    async function fetchProducer() {
      try {
        const res = await fetch(
          `${API_BASE}/api/destilerias/${producerId}/perfil`
        );

        if (!res.ok) throw new Error("Error al cargar destilería");

        const data = await res.json();

        setProducer({
          id: data.id_destileria,
          name: data.nombre_comercial,
          description: data.descripcion || "",
          logo: data.logo_url || null,
          persona: data.persona || null,
          galeria: data.galeria || [],
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducer();
  }, [producerId]);

  if (!producer) return <div className="pd-loading">Cargando…</div>;

  
  const heroImages =
    producer.galeria.length > 0
      ? producer.galeria.map((img) => `${API_BASE}/${img.imagen_url}`)
      : [];

  const next = () => {
    if (heroImages.length === 0) return;
    setSlide((s) => (s + 1) % heroImages.length);
  };

  const prev = () => {
    if (heroImages.length === 0) return;
    setSlide((s) => (s - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="pd-wrap">
      {/* HERO */}
      <div
        className="pd-hero"
        style={{
          backgroundImage:
            heroImages.length > 0
              ? `url(${heroImages[slide]})`
              : "linear-gradient(135deg, #f6b37f, #f28c28)",
        }}
      >
        <button className="pd-back" onClick={() => navigate(-1)}>
          ←
        </button>

        {heroImages.length > 1 && (
          <>
            <button className="pd-nav left" onClick={prev}>
              ‹
            </button>
            <button className="pd-nav right" onClick={next}>
              ›
            </button>
          </>
        )}
      </div>

      {/* INFO */}
      <h1 className="pd-title">{producer.name}</h1>

      {/* CONÓCENOS */}
      <section className="pd-section">
        <h2>Conócenos</h2>

        <div className="pd-about">
          <p>
            {producer.description ||
              "Somos una destilería artesanal dedicada a la elaboración de destilados premium."}
          </p>

          {producer.persona && (
            <div className="pd-master">
              <img
                src={`${API_BASE}/${producer.persona.imagen_url}`}
                alt={producer.persona.nombre}
              />
              <div>
                <strong>{producer.persona.nombre}</strong>
                <div>{producer.persona.descripcion}</div>
              </div>
            </div>
          )}
        </div>

        <div className="pd-icons">
          <div>🛒 Punto de venta disponible</div>
          <div>📍 Visitas turísticas</div>
          <div>🕒 Horario de atención: Lun a Vie 10:00 – 18:00</div>
        </div>
      </section>

      {/* EVENTO */}
      <section className="pd-section">
        <img className="pd-event" src={eventoImg} alt="Evento" />
        <div className="pd-event-label">
          Comparte en nuestros eventos y degustaciones
        </div>
      </section>

      {/* CÓCTELES (pendiente de CRUD) */}
      <section className="pd-section">
        <h2>Cócteles recomendados</h2>

        <div className="pd-grid">
          {[
            { img: c1, name: "Elqui Sour", tag: "Suave" },
            { img: c2, name: "Gin & Citrus", tag: "Refrescante" },
            { img: c3, name: "Barrica Old Fashioned", tag: "Intenso" },
            { img: c4, name: "Andes Mule", tag: "Equilibrado" },
            { img: c5, name: "Reserva Negroni", tag: "Amargo" },
            { img: c6, name: "Valle Spritz", tag: "Ligero" },
          ].map((c, i) => (
            <div key={i} className="pd-card">
              <img src={c.img} alt={c.name} />
              <div className="pd-name">{c.name}</div>
              <span className="pd-tag">{c.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <Link to="/productores" className="pd-back-link">
        ← Volver a destilerías
      </Link>

      
    </div>
  );
}
