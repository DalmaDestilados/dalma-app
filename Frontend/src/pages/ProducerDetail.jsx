import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

/* FALLBACKS */
import masterFallback from "../assets/Masters/MaestroDestilador.jpg";
import eventoImg from "../assets/Evento/Evento.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ProducerDetail() {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [slide, setSlide] = useState(0);

  /* =========================
     CARGAR PERFIL DESTILERÍA
  ========================= */
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
          nombre: data.nombre_comercial,
          descripcion: data.descripcion,
          ciudad: data.ciudad,
          pais: data.pais,
          logo: data.logo_url,
          persona: data.persona,
          galeria: data.galeria || [],
        });
      } catch (err) {
        console.error(err);
        navigate("/productores", { replace: true });
      }
    }

    fetchProducer();
  }, [producerId, navigate]);

  /* =========================
     CARGAR PRODUCTOS VINCULADOS
  ========================= */
  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch(
          `${API_BASE}/api/productos/public/destileria/${producerId}`
        );
        if (!res.ok) throw new Error();

        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error cargando productos", err);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    }

    fetchProductos();
  }, [producerId]);

  if (!producer) return <div className="pd-loading">Cargando…</div>;

  /* =========================
     IMÁGENES CARRUSEL
  ========================= */
  const images = producer.galeria.length
    ? producer.galeria.map((g) => `${API_BASE}/${g.imagen_url}`)
    : producer.logo
    ? [`${API_BASE}/${producer.logo}`]
    : [];

  /* =========================
     ASEGURAR MÍNIMO 3 IMÁGENES PARA CARRUSEL
  ========================= */
  const carouselImages = (() => {
    if (images.length >= 3) return images;
    if (images.length === 2) return [images[0], images[1], images[0]];
    if (images.length === 1) return [images[0], images[0], images[0]];
    return [];
  })();

  const next = () =>
    setSlide((s) => (images.length ? (s + 1) % images.length : 0));
  const prev = () =>
    setSlide((s) =>
      images.length ? (s - 1 + images.length) % images.length : 0
    );

  const nextCarousel = () =>
    setSlide((s) =>
      carouselImages.length ? (s + 1) % carouselImages.length : 0
    );

  const prevCarousel = () =>
    setSlide((s) =>
      carouselImages.length
        ? (s - 1 + carouselImages.length) % carouselImages.length
        : 0
    );

  return (
    <div className="pd-wrap">
      {/* HERO / GALERÍA */}
      <div
        className="pd-hero"
        style={{
          backgroundImage: carouselImages.length
            ? `url(${carouselImages[slide]})`
            : "none",
        }}
      >
        <button className="pd-back" onClick={() => navigate(-1)}>←</button>

        {carouselImages.length > 1 && (
          <>
            <button className="pd-nav left" onClick={prevCarousel}>‹</button>
            <button className="pd-nav right" onClick={nextCarousel}>›</button>
          </>
        )}
      </div>

      {/* INFO */}
      <h1 className="pd-title">{producer.nombre}</h1>

      {(producer.ciudad || producer.pais) && (
        <div className="pd-pill">
          {[producer.ciudad, producer.pais].filter(Boolean).join(", ")}
        </div>
      )}

      {/* CONÓCENOS */}
      <section className="pd-section">
        <h2>Conócenos</h2>

        <div className="pd-about">
          <p>{producer.descripcion}</p>

          <div className="pd-master">
            <img
              src={
                producer.persona?.imagen_url
                  ? `${API_BASE}/${producer.persona.imagen_url}`
                  : masterFallback
              }
              alt={producer.persona?.nombre || "Persona destacada"}
            />
            <div>
              <strong>
                {producer.persona?.nombre || "Maestro Destilador"}
              </strong>
              <div>
                {producer.persona?.descripcion || "Destilería"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO PRODUCTOR */}
      <section className="pd-section">
        <h2>Información del productor</h2>

        <ul className="pd-info-list">
          <li>📍 Dirección productor</li>
          <li>🌎 Región productor</li>
          <li>⏰ Horario de atención</li>
          <li>🏠 No cuenta con punto de venta propio</li>
          <li>🧭 No cuenta con visitas turísticas guiadas</li>
        </ul>
      </section>

      {/* PRODUCTOS */}
      <section className="pd-section">
        <h2>Nuestros productos</h2>

        {loadingProductos && <p>Cargando productos…</p>}

        {!loadingProductos && productos.length === 0 && (
          <p>No hay productos asociados a esta destilería.</p>
        )}

        <div className="pd-products-grid">
          {productos.map((p) => (
            <div
              key={p.id_producto}
              className="pd-product-card"
              onClick={() => navigate(`/productos/${p.id_producto}`)}
            >
              <img
                src={
                  p.imagen_url
                    ? `${API_BASE}/${p.imagen_url}`
                    : masterFallback
                }
                alt={p.nombre}
              />
              <h3>{p.nombre}</h3>
              <p>
                {p.contenido_neto} ml · {p.grado_alcoholico}%
              </p>
              <strong>
                ${Number(p.precio).toLocaleString("es-CL")}
              </strong>
            </div>
          ))}
        </div>
      </section>

       {/* EVENTO */}
      <section className="pd-section">
        <img className="pd-event" src={eventoImg} alt="Evento" />
        <div className="pd-event-label">
          Comparte en nuestros eventos y degustaciones
        </div>
      </section>


      {/* CÓCTELES RECOMENDADOS */}
      <section className="pd-section">
        <h2>Cócteles recomendados</h2>

        <div className="pd-products-grid">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="pd-product-card">
              <img src={eventoImg} alt="Cóctel" />
              <h3>Nombre cóctel</h3>
              <p>Suave</p>
            </div>
          ))}
        </div>
      </section>

     
      {/* CONTACTO */}
      <section className="pd-section">
        <h2>Conéctate con nosotros</h2>

        <div className="pd-contact-icons">
          <span>🌐</span>
          <span>📷</span>
          <span>📘</span>
          <span>✉️</span>
        </div>

        <form className="pd-contact-form">
          <input placeholder="Nombre" />
          <input placeholder="Teléfono" />
          <textarea placeholder="Mensaje" />
          <button type="button">Enviar</button>
        </form>
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
          background-color: #eee;
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

        .pd-product-card strong {
          color: #f28c28;
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

        .pd-back-link {
          display: block;
          text-align: center;
          margin: 20px 0;
        }

        .pd-info-list {
          list-style: none;
          padding: 0;
          line-height: 1.8;
          font-size: 14px;
        }

        .pd-contact-icons {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 22px;
          margin-bottom: 12px;
        }

        .pd-contact-form input,
        .pd-contact-form textarea {
          width: 100%;
          margin-bottom: 8px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .pd-contact-form button {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: none;
          background: #f28c28;
          color: #fff;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
