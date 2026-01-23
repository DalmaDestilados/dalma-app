import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      const res = await fetch(`${API_BASE}/api/productos/public`);
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="pl-loading">Cargando productos...</p>;
  if (error) return <p className="pl-error">{error}</p>;

  return (
    <div className="pl-wrap">
      <h2 className="pl-title">Productos</h2>

      {productos.length === 0 && (
        <p className="pl-empty">No hay productos disponibles.</p>
      )}

      <div className="pl-grid">
        {productos.map((p) => (
          <div
            key={p.id_producto}
            className="pl-card"
            onClick={() => navigate(`/productos/${p.id_producto}`)}
          >
            <img
              src={
                p.imagen_url
                  ? `${API_BASE}/${p.imagen_url}`
                  : "https://via.placeholder.com/300x400?text=Sin+Imagen"
              }
              alt={p.nombre}
            />

            <div className="pl-card-body">
              <h3>{p.nombre}</h3>
              <div className="pl-meta">
                <span>{p.grado_alcoholico}% abv</span>
                <span>{p.contenido_neto} cc</span>
              </div>
              <div className="pl-price">
                ${Number(p.precio).toLocaleString("es-CL")}
              </div>
              <span className="pl-cta">Ver producto →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ESTILOS (SE USAN DE VERDAD AHORA) ===== */}
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

        .pl-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #555;
          margin: 6px 0;
        }

        .pl-price {
          font-size: 18px;
          font-weight: 900;
          color: #111;
          margin-bottom: 6px;
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
