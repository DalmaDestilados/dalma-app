import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import EventModal from "../components/EventModal";

const API_BASE = import.meta.env.VITE_API_BASE 

export default function ProducerEvents() {
  const { producerId } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, [producerId]);

  async function fetchEventos() {
    try {
      const data = await apiFetch(`/eventos/destileria/${producerId}`);
      setEvents(data);
    } catch {
      setError("No se pudieron cargar los eventos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="events-wrap">
      <div className="events-header">
        <h1>Eventos & Turismo</h1>
        <p>Actividades exclusivas de esta destilería</p>

        <Link to={`/productores/${producerId}`} className="back-btn">
          ← Volver
        </Link>
      </div>

      {loading && <div className="empty">Cargando eventos...</div>}
      {error && <div className="empty error">{error}</div>}

      {!loading && events.length === 0 && (
        <div className="empty">
          Esta destilería aún no tiene eventos registrados.
        </div>
      )}

      <div className="events-grid">
        {events.map((e) => (
          <div
            key={e.id_evento}
            className="event-card"
            onClick={() => setSelectedEvent(e)}
          >
            {e.imagen_url && (
              <div
                className="event-img"
                style={{
                  backgroundImage: `url(${API_BASE}/${e.imagen_url})`,
                }}
              />
            )}

            <div className="event-body">
              {e.categoria && (
                <span className="event-type">{e.categoria}</span>
              )}

              <h3>{e.titulo}</h3>

              {e.descripcion && (
                <p className="event-description">{e.descripcion}</p>
              )}

              <div className="event-footer">
                📅 {new Date(e.fecha).toLocaleDateString("es-CL")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* ================== CSS ================== */}
      <style>{`
        .events-wrap {
          padding: 16px;
        }

        .events-header {
          margin-bottom: 18px;
        }

        .events-header h1 {
          font-size: 26px;
          font-weight: 900;
        }

        .events-header p {
          opacity: 0.75;
          margin-top: 4px;
        }

        .back-btn {
          display: inline-block;
          margin-top: 6px;
          font-weight: 800;
          color: #f28c28;
          text-decoration: none;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .event-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,0.12);
          cursor: pointer;
          transition: transform .2s ease;

          height: 380px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-img {
          height: 160px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .event-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .event-type {
          font-size: 12px;
          font-weight: 900;
          color: #f28c28;
          text-transform: uppercase;
        }

        .event-body h3 {
          font-size: 17px;
          font-weight: 900;
          margin: 0;
        }

        .event-description {
          font-size: 14px;
          line-height: 1.4;
          opacity: 0.85;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .event-footer {
          margin-top: auto;
          font-weight: 800;
          font-size: 13px;
          opacity: 0.7;
        }

        .empty {
          padding: 40px;
          text-align: center;
          font-weight: 800;
          opacity: 0.7;
        }

        .error {
          color: red;
        }

        /* ========== MOBILE ========= */
        @media (max-width: 480px) {
          .event-card {
            height: 300px;
          }

          .event-img {
            height: 130px;
          }

          .event-description {
            -webkit-line-clamp: 1;
            font-size: 13px;
          }

          .event-body h3 {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
