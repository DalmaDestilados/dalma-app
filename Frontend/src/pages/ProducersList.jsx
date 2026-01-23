import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api"; 

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

  useEffect(() => {
    fetchDestilerias();
  }, []);

  async function fetchDestilerias() {
    try {
      const data = await apiFetch("/destilerias/public");
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
    </div>
  );
}
