import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatarFallback from "../assets/Masters/MaestroDestilador.jpg";

const API_BASE = import.meta.env.VITE_API_BASE 

export default function BartendersList() {
  const [bartenders, setBartenders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/bartenders/public`)
      .then((r) => r.json())
      .then(setBartenders)
      .catch(() => setBartenders([]));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Bartenders</h2>

      {bartenders.map((b) => (
        <Link
          key={b.id_bartender}
          to={`/bartenders/${b.id_bartender}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src={
              b.foto_perfil
                ? `${API_BASE}${b.foto_perfil}`
                : avatarFallback
            }
            alt={b.nombre_publico}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <strong>{b.nombre_publico}</strong>
        </Link>
      ))}
    </div>
  );
}
