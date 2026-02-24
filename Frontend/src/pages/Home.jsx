import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import avatarFallback from "../assets/Masters/MaestroDestilador.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";



function getImageUrl(path) {
  if (!path) return null;
  const cleanPath = path.replace(/\\/g, "/");
  return `${API_BASE}/${cleanPath.replace(/^\/+/, "")}`;
}

export default function Home({ searchTerm, category }) {
  const [products, setProducts] = useState([]);
  const [producers, setProducers] = useState([]);
  const [bartenders, setBartenders] = useState([]);
  const [coctails, setCoctails] = useState([]); // <-- NUEVO
  const [slide, setSlide] = useState(0);
  const [masters, setMasters] = useState([]);

// FETCH productos
useEffect(() => {
  fetch(`${API_BASE}/api/productos/public`)
    .then((r) => r.json())
    .then((d) => setProducts(d || []))
    .catch(() => setProducts([]));
}, []);

// FETCH destilerías
useEffect(() => {
  fetch(`${API_BASE}/api/destilerias/public`)
    .then((r) => r.json())
    .then((d) => setProducers(d || []))
    .catch(() => setProducers([]));
}, []);

// FETCH bartenders
useEffect(() => {
  fetch(`${API_BASE}/api/bartenders/public`)
    .then((r) => r.json())
    .then((d) => setBartenders(d || []))
    .catch(() => setBartenders([]));
}, []);

// FETCH masters
useEffect(() => {
  fetch(`${API_BASE}/api/destilerias/public/masters`)
    .then((r) => r.json())
    .then((d) => setMasters(d || []))
    .catch(() => setMasters([]));
}, []);

// FETCH cocteles
useEffect(() => {
  fetch(`${API_BASE}/api/cocteles/public`)
    .then((r) => r.json())
    .then((d) => setCoctails(d || []))
    .catch(() => setCoctails([]));
}, []);

  // =========================
  // FILTRO DE BUSCADOR
  // =========================
 const filteredProducers = producers.filter((p) =>
  p?.nombre_comercial?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
);
  const filteredProducts = products.filter((p) =>
    p?.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const filteredBartenders = bartenders.filter((b) =>
    b?.nombre_publico?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const filteredCoctails = coctails.filter((c) =>
    c?.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const bestRated = useMemo(() => products.slice(0, 4), [products]);
const perPage = 2;
const totalPages = Math.max(1, Math.ceil(bestRated.length / perPage));
const pageItems = bestRated.slice(slide * perPage, slide * perPage + perPage);

function prev() {
  setSlide((s) => (s - 1 + totalPages) % totalPages);
}

function next() {
  setSlide((s) => (s + 1) % totalPages);
}

  return (
    <div className="home-wrap">
      {searchTerm && (
        <section className="home-section">
          <div className="section-title">Resultados de "{searchTerm}"</div>

          {/* DESTILERÍAS */}
          {filteredProducers.length > 0 && (
            <div>
              <h4>Destilerías</h4>
              <div className="card-container grid-2">
                {filteredProducers.map((p) => (
                  <Link
                    key={p.id_destileria}
                    to={`/productores/${p.id_destileria}`}
                    className="profile-card"
                  >
                   <img
  src={getImageUrl(p.logo_url) || avatarFallback}
  alt={p.nombre_comercial || "Destilería"}
/>
<div className="profile-name">{p.nombre_comercial || "Sin nombre"}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTOS */}
          {filteredProducts.length > 0 && (
            <div>
              <h4>Productos</h4>
              <div className="card-container grid-2">
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id_producto}
                    to={`/productos/${p.id_producto}`}
                    className="product-card"
                  >
                    <img
                      src={getImageUrl(p.imagen_url) || avatarFallback}
                      alt={p.nombre || "Producto"}
                    />
                    <div className="product-name">{p.nombre || "Sin nombre"}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CÓCTELES */}
          {filteredCoctails.length > 0 && (
            <div>
              <h4>Cocteles</h4>
              <div className="card-container grid-2">
                {filteredCoctails.map((c) => (
                  <Link
                    key={c.id_coctel}
                    to={`/cocteles/${c.id_coctel}`}
                    className="product-card"
                  >
                    <img
                      src={getImageUrl(c.imagen_url) || avatarFallback}
                      alt={c.nombre || "Cóctel"}
                    />
                    <div className="product-name">{c.nombre || "Sin nombre"}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BARTENDERS */}
          {filteredBartenders.length > 0 && (
            <div>
              <h4>Bartenders</h4>
              <div className="card-container grid-2">
                {filteredBartenders.map((b) => (
                  <Link
                    key={b.id_bartender}
                    to={`/bartenders/${b.id_bartender}`}
                    className="profile-card"
                  >
                    <img
                      src={getImageUrl(b.foto_perfil) || avatarFallback}
                      alt={b.nombre_publico || "Bartender"}
                    />
                    <div className="profile-name">{b.nombre_publico || "Sin nombre"}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* MENSAJE SI NO HAY RESULTADOS */}
          {filteredProducers.length === 0 &&
            filteredProducts.length === 0 &&
            filteredBartenders.length === 0 &&
            filteredCoctails.length === 0 && <p>No se encontraron resultados.</p>}
        </section>
      )}

      {/* ================= HERO ================= */}
      <section className="home-hero">
        {[
          {
            to: "/productos",
            label: "Encuentra tu destilado",
            bg: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1400&q=60",
          },
          {
            to: "/eventos",
            label: "Eventos & Turismo",
            bg: "https://images.unsplash.com/photo-1528823872057-9c018a7bfc48?auto=format&fit=crop&w=1400&q=60",
          },
          {
            to: "/cocteles",
            label: "Prepara tu Cóctel",
            bg: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=60",
          },
        ].map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="hero-card"
            style={{ backgroundImage: `url(${c.bg})` }}
          >
            <div className="hero-overlay">
              <span className="hero-btn">{c.label}</span>
            </div>
          </Link>
        ))}
      </section>


      {/* ================= MEET THE BEST ================= */}
      <section className="home-section">
        <div className="section-title">Meet the Best</div>

        <div className="card-container carousel-container">
          <button className="carousel-btn" onClick={prev}>‹</button>

          <div className="product-grid">
            {pageItems.map((p) => (
              <Link
                key={p.id_producto}
                to={`/productos/${p.id_producto}`}
                className="product-card"
              >
                <img
                  src={
                    p.imagen_url
                      ? getImageUrl(p.imagen_url)
                      : avatarFallback
                  }
                  alt={p.nombre}
                />
                <div className="product-name">{p.nombre}</div>
              </Link>
            ))}
          </div>

          <button className="carousel-btn" onClick={next}>›</button>
        </div>
      </section>

      {/* ================= MASTERS ================= */}
        <section className="home-section">
          <div className="section-title">Meet the Masters</div>

          <div className="card-container grid-2">
            {masters.slice(0, 4).map((m) => (
              <Link
                key={m.id_destileria}
                to={`/productores/${m.id_destileria}`}
                className="profile-card"
              >
                <img
                  src={getImageUrl(m.foto_url) || avatarFallback}
                  alt={m.nombre}
                  onError={(e) => (e.currentTarget.src = avatarFallback)}
                />

                <div className="profile-name">
                  {m.nombre}
                </div>

                <div className="profile-sub">
                  {m.descripcion || "Maestro destilador"}
                </div>
              </Link>
            ))}
          </div>
        </section>


      {/* ================= BARTENDERS ================= */}
      <section className="home-section">
        <div className="section-title">Meet the Bartenders 🍸</div>

        <div className="card-container grid-2">
          {bartenders.slice(0, 4).map((b) => (
            <Link
              key={b.id_bartender}
              to={`/bartenders/${b.id_bartender}`}
              className="profile-card"
            >
              <img
                src={getImageUrl(b.foto_perfil) || avatarFallback}
                alt={b.nombre_publico}
                onError={(e) => (e.currentTarget.src = avatarFallback)}
              />
              <div className="profile-name">
                {b.nombre_publico}
              </div>
              <div className="profile-sub">
                {b.especialidad || "Bartender profesional"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CSS ================= */}
      <style>{`
        .home-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .home-section {
          padding: 24px 14px;
        }

        .section-title {
          text-align: center;
          font-size: 18px;
          font-weight: 900;
          color: #f28c28;
          margin-bottom: 16px;
        }

        .card-container {
          background: #fff;
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 16px 32px rgba(0,0,0,0.08);
          padding: 14px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .profile-card {
          text-decoration: none;
          color: inherit;
          display: grid;
          gap: 8px;
          transition: transform 0.2s ease;
        }

        .profile-card:hover {
          transform: translateY(-4px);
        }

        .profile-card img {
          width: 100%;
          height: 170px;
          object-fit: cover;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .profile-name {
          font-weight: 900;
          color: #f28c28;
        }

        .profile-sub {
          font-size: 13px;
          opacity: 0.7;
          font-weight: 700;
        }

        .carousel-container {
          display: grid;
          grid-template-columns: 40px 1fr 40px;
          align-items: center;
          gap: 10px;
        }

        .carousel-btn {
          border: none;
          background: rgba(242,140,40,0.15);
          font-size: 22px;
          border-radius: 12px;
          cursor: pointer;
          height: 40px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .product-card img {
          width: 80px;
          height: 150px;
          object-fit: contain;
        }

        .product-name {
          font-size: 13px;
          font-weight: 800;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}
