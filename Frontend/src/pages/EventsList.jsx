import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import EventModal from "../components/EventModal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      const data = await apiFetch("/eventos");

      // SOLO EVENTOS GLOBALES
      const eventosGlobales = data.filter(
        (e) => e.id_destileria === null
      );

      setEvents(eventosGlobales);
    } catch {
      setError("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="events-wrap">
      <header className="events-header">
        <h1>Eventos & Turismo</h1>
        <p>
          Descubre experiencias, degustaciones y rutas turísticas organizadas
          por destilerías de todo Chile.
        </p>
      </header>

      {loading && <p className="center">Cargando eventos...</p>}
      {error && <p className="center error">{error}</p>}

      {!loading && events.length === 0 && (
        <p className="center empty">
          No hay eventos globales disponibles por ahora.
        </p>
      )}

      <section className="events-grid">
        {events.map((e) => (
          <article
            key={e.id_evento}
            className="event-card"
            onClick={() => setSelectedEvent(e)}
          >
            {e.imagen_url && (
              <div
                className="event-image"
                style={{
                  backgroundImage: `url(${API_BASE}/${e.imagen_url})`,
                }}
              />
            )}

            <div className="event-content">
              {e.categoria && (
                <span className="event-subtitle">{e.categoria}</span>
              )}

              <h2>{e.titulo}</h2>

              {e.descripcion && (
                <p className="event-description">{e.descripcion}</p>
              )}

              <div className="event-meta">
                {e.ubicacion && <span>📍 {e.ubicacion}</span>}
                {e.fecha && (
                  <span>
                    📅{" "}
                    {new Date(e.fecha).toLocaleDateString("es-CL")}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* ================= CSS ================= */}
      <style>{`
        .events-wrap {
          padding: 16px;
          max-width: 1200px;
          margin: auto;
        }

        .events-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .events-header h1 {
          font-size: 28px;
          font-weight: 900;
          color: #f28c28;
        }

        .events-header p {
          margin-top: 8px;
          font-weight: 600;
          color: rgba(0,0,0,0.65);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
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
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-image {
          height: 160px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .event-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .event-subtitle {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          color: #f28c28;
        }

        .event-content h2 {
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

        .event-meta {
          margin-top: auto;
          font-size: 13px;
          font-weight: 700;
          opacity: 0.7;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .center {
          text-align: center;
        }

        .error {
          color: red;
        }

        .empty {
          opacity: 0.6;
          font-weight: 700;
        }

        /* ========== MOBILE ========= */
        @media (max-width: 480px) {
          .event-card {
            height: 300px;
          }

          .event-image {
            height: 130px;
          }

          .event-description {
            -webkit-line-clamp: 1;
            font-size: 13px;
          }

          .event-content h2 {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
