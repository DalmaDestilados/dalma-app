import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   SVG DESTILERÍA (LOCAL)
========================= */
function DistillerySVG() {
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden="true">
      <rect x="0" y="0" width="200" height="120" rx="18" fill="#f5e3d3" />
      <rect x="20" y="45" width="90" height="45" rx="6" fill="#111" opacity="0.15" />
      <rect x="120" y="35" width="40" height="55" rx="6" fill="#111" opacity="0.18" />
      <rect x="135" y="15" width="10" height="20" rx="3" fill="#111" opacity="0.25" />
      <rect x="40" y="55" width="16" height="35" rx="8" fill="#f28c28" />
      <rect x="62" y="55" width="16" height="35" rx="8" fill="#f28c28" opacity="0.85" />
      <rect x="84" y="55" width="16" height="35" rx="8" fill="#f28c28" opacity="0.7" />
    </svg>
  );
}

export default function ProducersList() {
  const [destilerias, setDestilerias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api/destilerias";

  useEffect(() => {
    fetchDestilerias();
  }, []);

  async function fetchDestilerias() {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar las destilerías");
      const data = await res.json();
      setDestilerias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las destilerías");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="dalma-state">Cargando destilerías...</p>;
  if (error) return <p className="dalma-state error">{error}</p>;

  return (
    <div className="dalma-producers-page">
      <h2 className="dalma-title">Destilerías</h2>

      <div className="dalma-producers-grid">
        {destilerias.map((d) => (
          <div
            key={d.id_destileria}
            className="dalma-producer-card"
            onClick={() => navigate(`/productores/${d.id_destileria}`)}
          >
            <div className="dalma-producer-image">
              <DistillerySVG />
            </div>

            <div className="dalma-producer-body">
              <h3>{d.nombre_comercial}</h3>
              <p>
                {d.ciudad}, {d.pais}
              </p>
              <span className="dalma-cta">Ver destilería →</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .dalma-producers-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 18px 14px 100px;
          background: #f6f7fb;
        }

        .dalma-title {
          text-align: center;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #f28c28;
          margin-bottom: 22px;
        }

        .dalma-state {
          padding: 20px;
          text-align: center;
          font-weight: 700;
        }

        .dalma-state.error {
          color: red;
        }

        .dalma-producers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .dalma-producer-card {
          background: #fff;
          border-radius: 18px;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 14px 32px rgba(0,0,0,0.14);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          overflow: hidden;
        }

        .dalma-producer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.22);
        }

        .dalma-producer-image {
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            rgba(242,140,40,0.25),
            rgba(0,0,0,0.08)
          );
        }

        .dalma-producer-body {
          padding: 14px 16px 18px;
        }

        .dalma-producer-body h3 {
          font-size: 16px;
          font-weight: 900;
          margin-bottom: 6px;
          color: #111;
        }

        .dalma-producer-body p {
          font-size: 13px;
          color: rgba(0,0,0,0.65);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .dalma-cta {
          font-size: 13px;
          font-weight: 900;
          color: #f28c28;
        }
      `}</style>
    </div>
  );
}
