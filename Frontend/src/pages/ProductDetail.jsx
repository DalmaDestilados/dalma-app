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

      <section className="sku-section">
        <h3>Rueda de cata</h3>
        <div className="sku-wheel">
          <span>Aromas</span>
          <span>Dulzor</span>
          <span>Cuerpo</span>
          <span>Persistencia</span>
        </div>
      </section>

      <section className="sku-section">
        <h3>Opinión del especialista</h3>
        <strong>Juan Pérez · Maestro Destilador</strong>
        <p>
          Un destilado versátil, ideal para consumo directo o coctelería premium.
        </p>
      </section>

      <section className="sku-section">
        <h3>Cóctel recomendado</h3>
        <div className="sku-cocktail">
          <img src={coctelImg} alt="Cóctel recomendado" />
          <div>
            <h4>Pisco Sour Dalma</h4>
            <ul>
              <li>60 ml Pisco</li>
              <li>30 ml jugo de limón</li>
              <li>20 ml jarabe de goma</li>
              <li>1 clara de huevo</li>
              <li>Hielo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CSS ================= */}
      <style>{`
        .sku-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding-bottom: 90px;
          background: #fff;
          text-align: center;
        }

        .sku-hero {
          height: 240px;
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
        }

        .sku-bottle-wrap {
          width: 170px;
          margin: -100px auto 0;
          position: relative;
          z-index: 10;
        }

        .sku-bottle {
          width: 100%;
          filter: drop-shadow(0 18px 28px rgba(0,0,0,.35));
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
          font-size: 26px;
          font-weight: 900;
          margin-top: 8px;
        }

        .sku-actions {
          display: flex;
          justify-content: space-around;
          margin: 16px 0;
        }

        .sku-actions button {
          border: none;
          background: #fde9d8;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
        }

        .sku-section {
          padding: 20px 14px;
          border-top: 1px solid #eee;
          text-align: left;
        }

        .sku-wheel {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 10px;
          background: #eee;
          padding: 20px;
          border-radius: 16px;
        }

        .sku-cocktail {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 12px;
        }

        .sku-cocktail img {
          width: 100%;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
