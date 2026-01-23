import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* HERO (se mantiene visual) */
import hero1 from "../assets/Hero/Destileria3.jpg";
import hero2 from "../assets/Hero/Destileria4.jpg";
import hero3 from "../assets/Hero/Destileria5.jpg";

/* COCTEL (mock temporal) */
import coctelImg from "../assets/Cocteles/Coctel1.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const heroImages = [hero1, hero2, hero3];

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [rating, setRating] = useState(4);
  const [favorite, setFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  // 🔥 PRODUCTO DESDE LA DB (ENDPOINT PÚBLICO)
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/productos/public/${productId}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [productId]);

  // HERO AUTO
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((p) => (p + 1) % heroImages.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  if (!product)
    return <div style={{ padding: 20 }}>Producto no encontrado</div>;

  // 🖼️ IMAGEN REAL DEL PRODUCTO
  const bottleImage = product.imagen_url
    ? `${API_BASE}/${product.imagen_url}`
    : heroImages[0];

  const downloadPDF = () => {
    const blob = new Blob(
      [
        `Ficha técnica\n\nProducto: ${product.nombre}\nPrecio: ${product.precio}\nGraduación: ${product.grado_alcoholico}%`,
      ],
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
        <button className="sku-back" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      {/* BOTELLA (DESDE DB) */}
      <div className="sku-bottle-wrap">
        <img
          src={bottleImage}
          alt={product.nombre}
          className="sku-bottle"
        />
      </div>

      {/* RATING */}
      <div className="sku-rating">
        {[1, 2, 3, 4, 5].map((n) => (
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
        {product.stock > 0
          ? "(Con stock disponible)"
          : "(Sin stock)"}
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
        <button onClick={() => alert("Compartido")}>
          📤 Compartir
        </button>
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
        <strong>
          {product.destileria || "Maestro Destilador"}
        </strong>
        <p>
          Un destilado versátil, ideal para consumo directo o
          coctelería premium.
        </p>
      </section>

      {/* CÓCTEL (mock hasta CRUD) */}
      <section className="sku-section">
        <h3>Cóctel recomendado</h3>
        <div className="sku-cocktail">
          <img src={coctelImg} alt="Cóctel recomendado" />
          <div>
            <h4>Pisco Sour Dalma</h4>
            <ul>
              <li>60 ml producto</li>
              <li>30 ml jugo de limón</li>
              <li>20 ml jarabe</li>
              <li>Hielo</li>
            </ul>
            <p>
              Agitar todos los ingredientes y servir frío.
            </p>
          </div>
        </div>

        <button className="sku-pdf" onClick={downloadPDF}>
          Descargar ficha técnica PDF
        </button>
      </section>

      {/* CSS SE MANTIENE EXACTAMENTE IGUAL */}
    </div>
  );
}
