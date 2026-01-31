import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

/* HERO */
import hero1 from "../assets/Hero/Destileria3.jpg";
import hero2 from "../assets/Hero/Destileria4.jpg";
import hero3 from "../assets/Hero/Destileria5.jpg";

/* PRODUCTOS (FALLBACK POR CATEGORÍA) */
import piscoImg from "../assets/Productos/PiscoFondo.jpg";
import ginImg from "../assets/Productos/Gin.jpg";
import ronImg from "../assets/Productos/Ron.jpg";
import vodkaImg from "../assets/Productos/Vodka.jpg";
import whiskyImg from "../assets/Productos/Whisky.jpg";
import tequilaImg from "../assets/Productos/Tequila.jpg";

/* COCTEL */
import coctelImg from "../assets/Cocteles/Coctel1.jpg";

const heroImages = [hero1, hero2, hero3];

const productImages = {
  pisco: piscoImg,
  gin: ginImg,
  ron: ronImg,
  vodka: vodkaImg,
  whisky: whiskyImg,
  tequila: tequilaImg,
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

/* =========================
   ⭐ NUEVO: helper rueda cata
========================= */
function getCata(product) {
  return {
    aromas: Number(product.cata_aromas ?? 0),
    dulzor: Number(product.cata_dulzor ?? 0),
    cuerpo: Number(product.cata_cuerpo ?? 0),
    persistencia: Number(product.cata_persistencia ?? 0),
  };
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // ⭐ Valoraciones
  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingTotal, setRatingTotal] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [sending, setSending] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  /* =========================
     🔥 NUEVO: CÓCTEL RECOMENDADO
  ========================= */
  const [coctelRec, setCoctelRec] = useState(null);

  /* =========================
     PRODUCTO
  ========================= */
  useEffect(() => {
    apiFetch(`/productos/public/${productId}`)
      .then((data) => {
        if (data?.activo === 0) setProduct(null);
        else setProduct(data);
      })
      .catch(() => setProduct(null));
  }, [productId]);

  /* =========================
     🔥 CARGAR CÓCTEL RECOMENDADO
  ========================= */
  useEffect(() => {
    apiFetch(`/cocteles/public/recomendado/producto/${productId}`)
      .then((data) => setCoctelRec(data))
      .catch(() => setCoctelRec(null));
  }, [productId]);

  /* =========================
     HERO
  ========================= */
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((p) => (p + 1) % heroImages.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  /* =========================
     VALORACIONES
  ========================= */
  useEffect(() => {
    apiFetch(`/valoraciones/producto/${productId}`)
      .then((res) => {
        setRatingAvg(res.promedio || 0);
        setRatingTotal(res.total || 0);
      })
      .catch(() => {});

    apiFetch(`/valoraciones/producto/${productId}/usuario`)
      .then((res) => {
        if (res?.puntuacion) setUserRating(res.puntuacion);
      })
      .catch(() => {});
  }, [productId]);

  if (!product) {
    return <div style={{ padding: 20 }}>Producto no encontrado</div>;
  }

  const bottle = product.imagen_url
    ? `${API_BASE}/${product.imagen_url}`
    : productImages[product.categoria?.toLowerCase()] || piscoImg;

  async function handleRate(value) {
    if (sending) return;
    setSending(true);

    try {
      await apiFetch("/valoraciones/producto", {
        method: "POST",
        body: JSON.stringify({
          id_producto: productId,
          puntuacion: value,
        }),
      });

      setUserRating(value);

      const res = await apiFetch(`/valoraciones/producto/${productId}`);
      setRatingAvg(res.promedio || 0);
      setRatingTotal(res.total || 0);
    } catch (err) {
      alert(err.message || "Error al valorar");
    } finally {
      setSending(false);
    }
  }

  const avgSafe = Number(ratingAvg || 0).toFixed(1);
  const cata = getCata(product);

  return (
    <div className="sku-wrap">
      {/* HERO */}
      <div
        className="sku-hero"
        style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
      >
        <button className="sku-back" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      {/* BOTELLA */}
      <div className="sku-bottle-wrap">
        <img src={bottle} alt={product.nombre} className="sku-bottle" />
      </div>

      {/* ⭐ RATING */}
      <div className="sku-rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={(userRating || ratingAvg) >= n ? "on" : ""}
            onClick={() => handleRate(n)}
          >
            ★
          </span>
        ))}
        <span className="sku-score">
          {avgSafe}/5 ({ratingTotal})
        </span>
      </div>

      <div className="sku-price">
        ${Number(product.precio).toLocaleString("es-CL")}
      </div>

      <div className="sku-stock">
        {product.stock > 0 ? "(Con stock disponible)" : "(Sin stock)"}
      </div>

      <h2 className="sku-title">{product.nombre}</h2>

      <div className="sku-meta">
        {product.contenido_neto} cc · {product.grado_alcoholico}% abv
      </div>

      <div className="sku-actions">
        <button onClick={() => setFavorite(!favorite)}>
          {favorite ? "❤️ Favorito" : "🤍 Favoritos"}
        </button>
        <button onClick={() => setInCart(true)}>
          {inCart ? "✔ En carrito" : "🛒 Comprar"}
        </button>
        <button onClick={() => alert("Compartido")}>📤 Compartir</button>
      </div>

      <section className="sku-section">
        <h3>Descripción y notas de cata</h3>
        <p>
          {product.descripcion ||
            "Destilado de carácter equilibrado, aromas intensos y final persistente."}
        </p>
      </section>

      {/* =========================
          ⭐ RUEDA DE CATA REAL
      ========================= */}
      <section className="sku-section">
  <h3>Rueda de cata</h3>

  <div className="sku-wheel-svg">
    {/* SVG */}
    <svg width="220" height="220">
      {[1, 2, 3, 4, 5].map((lvl) => (
        <circle
          key={lvl}
          cx="110"
          cy="110"
          r={lvl * 16}
          fill="none"
          stroke="#ddd"
          strokeDasharray="4 4"
        />
      ))}

      <polygon
        points={`
          ${110},${110 - cata.aromas * 16}
          ${110 + cata.dulzor * 16},110
          ${110},${110 + cata.cuerpo * 16}
          ${110 - cata.persistencia * 16},110
        `}
        fill="rgba(242,140,40,0.45)"
        stroke="#f28c28"
        strokeWidth="2"
      />
    </svg>

    {/* 👉 COLUMNA DERECHA (ESTO NO EXISTÍA) */}
    <div className="sku-wheel-labels">
      <span>Aromas · {cata.aromas}/5</span>
      <span>Dulzor · {cata.dulzor}/5</span>
      <span>Cuerpo · {cata.cuerpo}/5</span>
      <span>Persistencia · {cata.persistencia}/5</span>
    </div>
  </div>
</section>


      {/* =========================
          🍸 CÓCTEL RECOMENDADO REAL
      ========================= */}
      <section className="sku-section">
        <h3>Cóctel recomendado</h3>

        {coctelRec ? (
  <div
    className="sku-cocktail"
    onClick={() => navigate(`/cocteles/${coctelRec.id_coctel}`)}
    style={{ cursor: "pointer" }}
  >
    <img
      src={
        coctelRec.imagen_url
          ? `${API_BASE}/${coctelRec.imagen_url}`
          : coctelImg
      }
      alt={coctelRec.nombre}
    />
    <div>
      <h4>{coctelRec.nombre}</h4>
      <ul>
        {coctelRec.ingredientes?.map((i, idx) => (
          <li key={idx}>
            {i.ingrediente}
            {i.cantidad ? ` (${i.cantidad})` : ""}
          </li>
        ))}
      </ul>
    </div>
  </div>
) : (
  <p>No hay cóctel recomendado para este producto.</p>
)}
      </section>

      {/* ================= CSS ================= */}
{/* ================= CSS ================= */}
{/* ================= CSS ================= */}
<style>{`
  .sku-wrap {
    max-width: 420px;
    margin: 0 auto;
    padding-bottom: 90px;
    background: #fff;
    text-align: center;
    position: relative;
  }

  .sku-hero {
    height: 270px;
    background-size: cover;
    background-position: center;
    border-radius: 0 0 26px 26px;
    position: relative;
  }

  .sku-back {
    position: absolute;
    top: 14px;
    left: 14px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #f6b37f;
    font-size: 20px;
    z-index: 50;
  }

  /* ===============================
     BOTELLA – MOCKUP REAL
     GRANDE / IZQUIERDA / OCUPA ESPACIO
  =============================== */

  .sku-bottle-wrap {
    position: absolute;
    top: 180px;               /* baja la botella */
    left: 0;                  /* 🔥 se va a la izquierda */
    width: 55%;               /* 🔥 ocupa espacio blanco */
    display: flex;
    justify-content: center;
    z-index: 30;
    pointer-events: none;
  }

  .sku-bottle {
    width: 100%;
    max-width: 260px;         /* 🔥 botella grande */
    height: auto;

    background: transparent;
    mix-blend-mode: multiply;

    transform: translateX(-10%) translateY(10px);
    filter: drop-shadow(0 40px 55px rgba(0,0,0,0.45));
  }

  /* ===============================
     INFO PRODUCTO A LA DERECHA
  =============================== */

  .sku-rating,
  .sku-price,
  .sku-stock,
  .sku-title,
  .sku-meta,
  .sku-actions {
    margin-left: 45%;         /* 🔥 deja espacio botella */
    text-align: left;
  }

  .sku-rating {
    margin-top: 12px;
  }

  .sku-rating span {
    font-size: 22px;
    cursor: pointer;
    color: #ccc;
  }

  .sku-rating .on {
    color: #f28c28;
  }

  .sku-score {
    margin-left: 6px;
    font-weight: 700;
  }

  .sku-price {
    font-size: 28px;
    font-weight: 900;
    margin-top: 8px;
  }

  .sku-stock {
    font-size: 13px;
    opacity: 0.7;
  }

  .sku-title {
    font-size: 20px;
    font-weight: 900;
    margin-top: 10px;
  }

  .sku-meta {
    font-size: 14px;
    opacity: 0.8;
  }

  .sku-actions {
    display: flex;
    gap: 10px;
    margin: 16px 0;
  }

  .sku-actions button {
    border: none;
    background: #fde9d8;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 12px;
    white-space: nowrap;
  }

  /* =========================
     SECCIONES NORMALES
  ========================= */

  .sku-section {
    padding: 20px 14px;
    border-top: 1px solid #eee;
    text-align: left;
    margin-top: 20px;
  }

  /* =========================
     RUEDA DE CATA
  ========================= */

  .sku-wheel-svg {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    align-items: center;
    margin-top: 14px;
  }

  .sku-wheel-svg svg {
    display: block;
    margin: 0 auto;
  }

  .sku-wheel-labels {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sku-wheel-labels span {
    background: #fff7ef;
    border: 1px solid #f6b37f;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }

  /* =========================
     CÓCTEL
  ========================= */

  .sku-cocktail {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 14px;
    align-items: center;
    background: #fff7ef;
    padding: 14px;
    border-radius: 18px;
    box-shadow: 0 10px 22px rgba(0,0,0,.08);
  }

  .sku-cocktail img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 14px;
  }

  /* =========================
     MOBILE AJUSTE FINO
  ========================= */

  @media (max-width: 380px) {
    .sku-bottle-wrap {
      width: 60%;
      top: 110px;
    }

    .sku-bottle {
      max-width: 220px;
    }

    .sku-rating,
    .sku-price,
    .sku-stock,
    .sku-title,
    .sku-meta,
    .sku-actions {
      margin-left: 50%;
    }
  }
`}</style>


    </div>
  );
}
