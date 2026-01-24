import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ===== IMÁGENES LOCALES ===== */
import ginImg from "../assets/Productos/Gin.jpg";
import piscoImg from "../assets/Productos/Pisco.jpg";
import ronImg from "../assets/Productos/Ron.jpg";
import tequilaImg from "../assets/Productos/Tequila.jpg";
import vodkaImg from "../assets/Productos/Vodka.jpg";
import whiskyImg from "../assets/Productos/Whisky.jpg";

/* ===== MAPA CATEGORÍA → IMAGEN ===== */
const productImages = {
  gin: ginImg,
  pisco: piscoImg,
  ron: ronImg,
  tequila: tequilaImg,
  vodka: vodkaImg,
  whisky: whiskyImg,
};

/* ===== NORMALIZADOR DE CATEGORÍAS ===== */
function normalizeCategory(cat = "") {
  const c = cat.toLowerCase();

  if (c.includes("gin")) return "gin";
  if (c.includes("pisco")) return "pisco";
  if (c.includes("ron")) return "ron";
  if (c.includes("tequila")) return "tequila";
  if (c.includes("vodka")) return "vodka";
  if (c.includes("whisky") || c.includes("whiskey")) return "whisky";

  return null;
}

export default function ProductList() {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ ENDPOINT PÚBLICO CORRECTO
  const API_URL = "http://localhost:3001/api/productos/public";

  useEffect(() => {
    fetchProductos();
  }, [producerId]);

  async function fetchProductos() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("No se pudieron cargar los productos");

      let data = await res.json();

      // filtrar por destilería si viene desde ProducerDetail
      if (producerId) {
        data = data.filter(
          (p) => String(p.id_destileria) === String(producerId)
        );
      }

      setProductos(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="pl-loading">Cargando productos…</p>;
  if (error) return <p className="pl-error">{error}</p>;

  return (
    <div className="pl-wrap">
      <h2 className="pl-title">Nuestros productos</h2>

      {productos.length === 0 && (
        <p className="pl-empty">No hay productos disponibles.</p>
      )}

      <div className="pl-grid">
        {productos.map((p) => {
          const key = normalizeCategory(p.categoria);
          const img = productImages[key] || piscoImg;

          return (
            <div
              key={p.id_producto}
              className="pl-card"
              onClick={() => navigate(`/productos/${p.id_producto}`)}
            >
              <img src={img} alt={p.nombre} />

              <div className="pl-card-body">
                <h3>{p.nombre}</h3>
                <p className="pl-category">{p.categoria}</p>

                <div className="pl-meta">
                  <span>{p.contenido_neto} ml</span>
                  <span>{p.grado_alcoholico}°</span>
                </div>

                <div className="pl-price">
                  ${Number(p.precio).toLocaleString("es-CL")}
                </div>

                <span className="pl-cta">Ver producto →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== ESTILOS ===== */}
      <style>{`
        .pl-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 16px 80px;
        }

        .pl-title {
          text-align: center;
          color: #f28c28;
          margin-bottom: 22px;
        }

        .pl-loading,
        .pl-error,
        .pl-empty {
          padding: 20px;
          text-align: center;
        }

        .pl-error {
          color: red;
        }

        .pl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .pl-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(0,0,0,0.12);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .pl-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        }

        .pl-card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: #f5f5f5;
        }

        .pl-card-body {
          padding: 14px;
        }

        .pl-card-body h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
        }

        .pl-category {
          font-size: 13px;
          color: #666;
          margin: 4px 0 10px;
        }

        .pl-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #555;
          margin-bottom: 10px;
        }

        .pl-price {
          font-size: 18px;
          font-weight: 900;
          color: #111;
          margin-bottom: 8px;
        }

        .pl-cta {
          font-size: 13px;
          font-weight: 800;
          color: #f28c28;
        }
      `}</style>
    </div>
  );
}
