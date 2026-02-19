import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

/* HERO */
import hero1 from "../assets/Hero/Destileria3.jpg";
import hero2 from "../assets/Hero/Destileria4.jpg";
import hero3 from "../assets/Hero/Destileria5.jpg";

/* PRODUCTOS */
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

  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingTotal, setRatingTotal] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [sending, setSending] = useState(false);

  const [favorite, setFavorite] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);

  const [coctelRec, setCoctelRec] = useState(null);

  /* PRODUCTO */
  useEffect(() => {
    apiFetch(`/productos/public/${productId}`)
      .then((data) => {
        if (data?.activo === 0) setProduct(null);
        else setProduct(data);
      })
      .catch(() => setProduct(null));
  }, [productId]);

  /* CHECK FAVORITOS / DESEOS */
  useEffect(() => {
    async function checkUserLists() {
      try {
        const favs = await apiFetch("/favoritos");
        const deseos = await apiFetch("/deseos");

        setFavorite(
          favs.some((p) => p.id_producto === Number(productId))
        );

        setInWishlist(
          deseos.some((p) => p.id_producto === Number(productId))
        );
      } catch {
        // no logueado
      }
    }

    checkUserLists();
  }, [productId]);

  /* CÓCTEL */
  useEffect(() => {
    apiFetch(`/cocteles/public/recomendado/producto/${productId}`)
      .then(setCoctelRec)
      .catch(() => setCoctelRec(null));
  }, [productId]);

  /* HERO */
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((p) => (p + 1) % heroImages.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  /* VALORACIONES */
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

  async function toggleFavorite() {
    try {
      await apiFetch(`/favoritos/${productId}`, {
        method: favorite ? "DELETE" : "POST",
      });
      setFavorite(!favorite);
    } catch {
      alert("Debes iniciar sesión");
    }
  }

  async function toggleWishlist() {
    try {
      await apiFetch(`/deseos/${productId}`, {
        method: inWishlist ? "DELETE" : "POST",
      });
      setInWishlist(!inWishlist);
    } catch {
      alert("Debes iniciar sesión");
    }
  }

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
      alert("Error al valorar");
    } finally {
      setSending(false);
    }
  }

  const bottle = product.imagen_url
    ? `${API_BASE}/${product.imagen_url}`
    : productImages[product.categoria?.toLowerCase()] || piscoImg;

  const avgSafe = Number(ratingAvg || 0).toFixed(1);
  const cata = getCata(product);

  return (
    <div className="sku-wrap">

      <div
        className="sku-hero"
        style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
      >
        <button className="sku-back" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <div className="sku-bottle-wrap">
        <img src={bottle} alt={product.nombre} className="sku-bottle" />
      </div>

      <div className="sku-rating">
        {[1,2,3,4,5].map(n => (
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
        <button
          className={favorite ? "active-fav" : ""}
          onClick={toggleFavorite}
        >
          {favorite ? "❤️ En favoritos" : "🤍 Favoritos"}
        </button>

        <button
          className={inWishlist ? "active-wish" : ""}
          onClick={toggleWishlist}
        >
          {inWishlist ? "⭐ En deseos" : "☆ Lista deseos"}
        </button>

        <button onClick={() => setInCart(true)}>
          {inCart ? "✔ En carrito" : "🛒 Comprar"}
        </button>
      </div>

<style>{`

/* =========================
   WRAP GENERAL
========================= */

.sku-wrap {
  max-width: 420px;
  margin: 0 auto;
  padding-bottom: 90px;
  background: #fff;
  text-align: center;
  position: relative;
}

/* =========================
   HERO
========================= */

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
  cursor: pointer;
  transition: 0.2s ease;
}

.sku-back:hover {
  transform: scale(1.05);
}

/* =========================
   BOTELLA
========================= */

.sku-bottle-wrap {
  position: absolute;
  top: 180px;
  left: 0;
  width: 55%;
  display: flex;
  justify-content: center;
  z-index: 30;
  pointer-events: none;
}

.sku-bottle {
  width: 100%;
  max-width: 260px;
  height: auto;
  background: transparent;
  mix-blend-mode: multiply;
  transform: translateX(-10%) translateY(10px);
  filter: drop-shadow(0 40px 55px rgba(0,0,0,0.45));
}

/* =========================
   INFO DERECHA
========================= */

.sku-rating,
.sku-price,
.sku-stock,
.sku-title,
.sku-meta,
.sku-actions {
  margin-left: 45%;
  text-align: left;
}

.sku-rating {
  margin-top: 12px;
}

.sku-rating span {
  font-size: 22px;
  cursor: pointer;
  color: #ccc;
  transition: 0.2s ease;
}

.sku-rating span:hover {
  transform: scale(1.1);
}

.sku-rating .on {
  color: #f28c28;
}

.sku-score {
  margin-left: 6px;
  font-weight: 700;
}

/* =========================
   PRECIO
========================= */

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

/* =========================
   ACCIONES
========================= */

.sku-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.sku-actions button {
  border: none;
  background: #fde9d8;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.sku-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

/* FAVORITO ACTIVO */

.active-fav {
  background: #ffdede !important;
  color: #c40000;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(196,0,0,0.2);
}

/* DESEO ACTIVO */

.active-wish {
  background: #fff3c6 !important;
  color: #b37b00;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(179,123,0,0.25);
}

/* =========================
   SECCIONES
========================= */

.sku-section {
  padding: 20px 14px;
  border-top: 1px solid #eee;
  text-align: left;
  margin-top: 20px;
}

/* =========================
   RESPONSIVE FINO
========================= */

@media (max-width: 380px) {
  .sku-bottle-wrap {
    width: 60%;
    top: 160px;
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
