import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// =========================
// Función de búsqueda y filtro
// =========================
function matchesSearchAndCategory({ searchTerm, category, product, producer }) {
  const s = (searchTerm || "").trim().toLowerCase();

  const matchText =
    !s ||
    (product?.name || "").toLowerCase().includes(s) ||
    (product?.type || "").toLowerCase().includes(s) ||
    (producer?.name || "").toLowerCase().includes(s);

  const matchCategory =
    !category || category === "Todos"
      ? true
      : (product?.type || "").toLowerCase() === String(category).toLowerCase();

  return matchText && matchCategory;
}

// =========================
// SVG botella placeholder
// =========================
function BottleSVG({ style }) {
  return (
    <svg
      viewBox="0 0 120 260"
      style={style}
      role="img"
      aria-label="Botella"
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(0,0,0,0.08)" />
          <stop offset="1" stopColor="rgba(242,140,40,0.18)" />
        </linearGradient>
      </defs>
      <rect x="50" y="10" width="20" height="45" rx="8" fill="rgba(0,0,0,0.25)" />
      <rect x="46" y="48" width="28" height="20" rx="10" fill="rgba(0,0,0,0.18)" />
      <rect x="30" y="65" width="60" height="170" rx="26" fill="url(#g)" stroke="rgba(0,0,0,0.10)" />
      <rect x="35" y="120" width="50" height="55" rx="10" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.10)" />
      <path d="M40 150 L80 150" stroke="rgba(242,140,40,0.9)" strokeWidth="3" />
      <path d="M42 160 L78 160" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      <path d="M42 170 L78 170" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
      <rect x="34" y="185" width="52" height="35" rx="10" fill="rgba(0,0,0,0.04)" />
    </svg>
  );
}
export default function Home({ searchTerm = "", category = "Todos" }) {
  const [products, setProducts] = useState([]);
  const [producers, setProducers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/productos/public")
      .then((r) => r.json())
      .then((d) => setProducts(d || []))
      .catch(() => setProducts([]));

    fetch("http://localhost:3001/api/destilerias/public")
      .then((r) => r.json())
      .then((d) => setProducers(d || []))
      .catch(() => setProducers([]));
  }, []);

  const getProducer = (producerId) =>
    producers.find(
      (x) => String(x.id_destileria) === String(producerId)
    );

  // =========================
// 🔍 BUSCADOR GLOBAL POR SECCIONES
// =========================
const searchLower = searchTerm.trim().toLowerCase();

const searchedProducts = useMemo(() => {
  if (!searchLower) return [];
  return products.filter((p) => {
    const pr = getProducer(p.id_destileria);
    return (
      p.nombre?.toLowerCase().includes(searchLower) ||
      p.categoria?.toLowerCase().includes(searchLower) ||
      pr?.nombre_comercial?.toLowerCase().includes(searchLower)
    );
  });
}, [searchLower, products, producers]);


const searchedProducers = useMemo(() => {
  if (!searchLower) return [];
  return producers.filter((d) =>
    d.nombre_comercial?.toLowerCase().includes(searchLower)
  );
}, [searchLower, producers]);

  // =========================
  // Filtrado top rated
  // =========================
  const bestRated = useMemo(() => {
    const filtered = products.filter((p) => {
      const pr = getProducer(p.producerId);
      return matchesSearchAndCategory({
        searchTerm,
        category,
        product: p,
        producer: pr,
      });
    });
    return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  }, [searchTerm, category]);

  // =========================
  // Carrusel de botellas
  // =========================
  const [slide, setSlide] = useState(0);
  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(bestRated.length / perPage));
  const pageItems = bestRated.slice(slide * perPage, slide * perPage + perPage);

  function prev() {
    setSlide((s) => (s - 1 + totalPages) % totalPages);
  }
  function next() {
    setSlide((s) => (s + 1) % totalPages);
  }

  // =========================
  // Masters (2x2 fotos)
  // =========================
  const masters = useMemo(
    () => [
      {
        id: "m1",
        name: "Master Nombre 1",
        role: "Master Nombre 1",
        photo:
          "https://images.unsplash.com/photo-1520975958225-6b74fca9d3b2?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "m2",
        name: "Master Nombre 2",
        role: "Master Nombre 2",
        photo:
          "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "m3",
        name: "Master Nombre 3",
        role: "Master Nombre 3",
        photo:
          "https://images.unsplash.com/photo-1514361892635-eae31da6f09b?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "m4",
        name: "Master Nombre 4",
        role: "Master Nombre 4",
        photo:
          "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=60",
      },
    ],
    []
  );

  // =========================
  // Resultados de búsqueda
  // =========================
  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter((p) => {
      const pr = getProducer(p.producerId);
      return matchesSearchAndCategory({ searchTerm, category, product: p, producer: pr });
    });
  }, [searchTerm, category]);
  // =========================
  // HERO (3 cards con foto + botón centrado)
  // =========================
  const heroCards = [
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
  ];

  return (
    <div className="home-wrap">

      {/* =========================
    🔍 RESULTADOS DE BÚSQUEDA
========================= */}
{searchLower && (
  <section className="home-section">
    <div className="section-title">Resultados</div>

  {/* DESTILERÍAS */}
{searchedProducers.map((d) => (
  <Link
    key={d.id_destileria}
    to={`/productores/${d.id_destileria}`}
    style={{ display: "block", marginBottom: 6 }}
  >
    {d.nombre_comercial}
  </Link>
))}


{/* PRODUCTOS */}
{searchedProducts.map((p) => (
  <Link
    key={p.id_producto}
    to={`/productos/${p.id_producto}`}
    style={{ display: "block", marginBottom: 6 }}
  >
    {p.nombre} · {p.categoria}
  </Link>
))}


{searchedProducts.length === 0 &&
  searchedProducers.length === 0 && (
    <div style={{ opacity: 0.7 }}>
      No se encontraron resultados
    </div>
)}


    {searchedProducts.length === 0 &&
      searchedProducers.length === 0 && (
        <div style={{ opacity: 0.7 }}>
          No se encontraron resultados
        </div>
      )}
  </section>
)}

      {/* HERO */}
      <section className="home-hero" style={{ marginTop: 4 }}>
        {heroCards.map((c) => (
          <div
            key={c.label}
            className="hero-card"
            style={{
              backgroundImage: `url(${c.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(1.05)",
            }}
          >
            <div
              className="hero-overlay"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.26) 100%)",
              }}
            >
              <Link to={c.to} className="hero-btn">
                {c.label}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* MEET THE BEST */}
      <section className="home-section">
        <div className="section-title" style={{ textTransform: "none" }}>
          meet the best!
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.08)",
            padding: "14px 12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "42px 1fr 42px",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "rgba(242,140,40,0.10)",
                fontSize: 22,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ‹
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                alignItems: "center",
                justifyItems: "center",
                minHeight: 190,
              }}
            >
              {pageItems.length ? (
                pageItems.map((p) => {
                  const pr = getProducer(p.producerId);
                  return (
                    <Link
                      key={p.id}
                      to={`/skus/${p.id}`}
                      style={{
                        width: "100%",
                        display: "grid",
                        justifyItems: "center",
                        gap: 8,
                        padding: "6px 6px 2px",
                      }}
                      title={`${p.name} · ${pr?.name || "Productor"}`}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: "78px",
                            height: "170px",
                            objectFit: "contain",
                            filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.18))",
                          }}
                        />
                      ) : (
                        <BottleSVG
                          style={{
                            width: 78,
                            height: 170,
                            filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.18))",
                          }}
                        />
                      )}

                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 900,
                          color: "rgba(0,0,0,0.72)",
                          lineHeight: 1.1,
                        }}
                      >
                        <div style={{ fontWeight: 1000, color: "#111" }}>
                          {(p.rating || 0).toFixed(1)} ★
                        </div>
                        <div style={{ opacity: 0.75 }}>{p.type}</div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div style={{ gridColumn: "1 / -1", opacity: 0.7, fontWeight: 800 }}>
                  No hay productos para mostrar.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "rgba(242,140,40,0.10)",
                fontSize: 22,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              marginTop: 12,
              height: 2,
              background: "rgba(242,140,40,0.35)",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === slide ? "rgba(242,140,40,0.95)" : "rgba(0,0,0,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
      {/* MEET THE MASTERS (título + grilla 2x2 con fotos) */}
      <section className="home-section">
        <div className="section-title" style={{ textTransform: "none" }}>
          Meet the Masters!
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.08)",
            padding: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {masters.map((m) => (
              <div key={m.id} style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    height: 170,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.10)",
                    background: "rgba(0,0,0,0.04)",
                  }}
                >
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.08)",
                        color: "#333",
                        fontWeight: 900,
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                <div style={{ fontWeight: 1000, color: "var(--dalma-orange)" }}>
                  {m.name}
                </div>
                <div style={{ fontWeight: 900, color: "rgba(0,0,0,0.72)", marginTop: -4 }}>
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTADOS (solo si hay búsqueda) */}
      {results.length > 0 && (
        <section className="home-section">
          <div className="section-title" style={{ textTransform: "none" }}>
            Resultados
          </div>

          <div className="dalma-feed">
            {results.slice(0, 12).map((p) => {
              const pr = getProducer(p.producerId) || {};
              return (
                <Link key={p.id} to={`/skus/${p.id}`} className="dalma-feed-item">
                  <div
                    className="dalma-thumb"
                    aria-hidden="true"
                    style={{
                      backgroundImage: p.image ? `url(${p.image})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="dalma-feed-text">
                    <div className="dalma-feed-name">{p.name}</div>
                    <div className="dalma-feed-sub">
                      {pr.name || "Productor"} · {p.type}
                    </div>
                    <div className="dalma-feed-meta">
                      <span className="dalma-star">★</span>{" "}
                      {(p.rating || 0).toFixed(1)}
                      <span style={{ opacity: 0.7 }}>
                        {" "}
                        · ${Number(p.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
/* =========================
   🔍 BUSCADOR GLOBAL HOME
========================= */

.home-section {
  position: relative;
  z-index: 30;
}

/* Contenedor flotante del buscador */
.home-section:first-of-type {
  position: sticky;
  top: 64px; /* debajo del header */
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 12px 12px 20px;
  padding: 14px 16px;
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.14),
    0 2px 6px rgba(0, 0, 0, 0.08);
  z-index: 999;
}

/* Título */
.home-section:first-of-type .section-title {
  font-size: 14px;
  font-weight: 900;
  color: #f28c28;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Subtítulos (Destilerías / Productos) */
.home-section:first-of-type h3 {
  font-size: 13px;
  font-weight: 900;
  margin-top: 10px;
  margin-bottom: 6px;
  color: #000;
}

/* Links de resultados */
.home-section:first-of-type a {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  color: #000;
  background: rgba(242, 140, 40, 0.12);
  text-decoration: none;
  transition: all 0.18s ease;
}

/* Hover */
.home-section:first-of-type a:hover {
  background: #f28c28;
  color: #000;
  transform: translateY(-1px);
}

/* Mensaje sin resultados */
.home-section:first-of-type div[style*="opacity"] {
  padding: 10px;
  font-weight: 700;
  font-size: 14px;
}

/* Evita que el buscador tape el HERO */
.home-hero {
  margin-top: 160px;
}

/* Responsive */
@media (max-width: 480px) {
  .home-section:first-of-type {
    top: 56px;
    padding: 12px;
  }

  .home-hero {
    margin-top: 180px;
  }
}
`}</style>

    </div>
  );
}
