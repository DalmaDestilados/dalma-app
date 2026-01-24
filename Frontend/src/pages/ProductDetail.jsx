import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [rating, setRating] = useState(4);
  const [favorite, setFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    axios
      // ✅ RUTA PÚBLICA CORRECTA
      .get(`${API_BASE}/api/productos/public/${productId}`)
      .then((res) => {
        if (res.data?.activo === 0) {
          setProduct(null);
        } else {
          setProduct(res.data);
        }
      })
      .catch(() => setProduct(null));
  }, [productId]);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((p) => (p + 1) % heroImages.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  if (!product)
    return <div style={{ padding: 20 }}>Producto no encontrado</div>;

  const bottle =
    productImages[product.categoria?.toLowerCase()] || piscoImg;

  const downloadPDF = () => {
    const blob = new Blob(
      [`Ficha técnica\n\nProducto: ${product.nombre}`],
      { type: "application/pdf" }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${product.nombre}.pdf`;
    link.click();
  };

  return (
    <div className="sku-wrap">
      {/* HERO */}
      <div
        className="sku-hero"
        style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
      >
        <button className="sku-back" onClick={() => navigate(-1)}>←</button>
      </div>

      {/* BOTELLA */}
      <div className="sku-bottle-wrap">
        <img
          src={bottle}
          alt={product.nombre}
          className="sku-bottle"
        />
      </div>

      {/* RATING */}
      <div className="sku-rating">
        {[1,2,3,4,5].map((n) => (
          <span
            key={n}
            className={rating >= n ? "on" : ""}
            onClick={() => setRating(n)}
          >
            ★
          </span>
        ))}
        <span className="sku-score">{rating}/5</span>
      </div>

      {/* PRECIO */}
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

      {/* ACCIONES */}
      <div className="sku-actions">
        <button onClick={() => setFavorite(!favorite)}>
          {favorite ? "❤️ Favorito" : "🤍 Favoritos"}
        </button>
        <button onClick={() => setInCart(true)}>
          {inCart ? "✔ En carrito" : "🛒 Comprar"}
        </button>
        <button onClick={() => alert("Compartido")}>📤 Compartir</button>
      </div>

      {/* DESCRIPCIÓN */}
      <section className="sku-section">
        <h3>Descripción y notas de cata</h3>
        <p>
          {product.descripcion ||
            "Destilado de carácter equilibrado, aromas intensos y final persistente."}
        </p>
      </section>

      {/* RUEDA */}
      <section className="sku-section">
        <h3>Rueda de cata</h3>
        <div className="sku-wheel">
          <span>Aromas</span>
          <span>Dulzor</span>
          <span>Cuerpo</span>
          <span>Persistencia</span>
        </div>
      </section>

      {/* OPINIÓN */}
      <section className="sku-section">
        <h3>Opinión del especialista</h3>
        <strong>Juan Pérez · Maestro Destilador</strong>
        <p>
          Un destilado versátil, ideal para consumo directo o coctelería premium.
        </p>
      </section>

      {/* CÓCTEL */}
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
            <p>
              Agitar todos los ingredientes en seco, luego con hielo y servir frío.
            </p>
          </div>
        </div>

        <button className="sku-pdf" onClick={downloadPDF}>
          Descargar ficha técnica PDF
        </button>
      </section>

      {/* CSS */}
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

        /* BOTELLA CORRECTA */
        .sku-bottle-wrap {
          width: 170px;
          margin: -100px auto 0;
          position: relative;
          z-index: 10;
        }

        .sku-bottle {
          width: 100%;
          display: block;
          filter: drop-shadow(0 18px 28px rgba(0,0,0,.35));
        }

        /* OVERLAY QUE ELIMINA EL FONDO BLANCO */
        .sku-bottle-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.4) 55%,
            rgba(255,255,255,0.85) 75%,
            #fff 100%
          );
          pointer-events: none;
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

        .sku-pdf {
          margin-top: 16px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 999px;
          background: #f6b37f;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
