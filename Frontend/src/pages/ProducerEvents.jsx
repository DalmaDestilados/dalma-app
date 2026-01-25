import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProducerEvents() {
  const { producerId } = useParams();

  /* =========================
     EVENTOS MOCK (luego DB)
  ========================= */
  const allEvents = [
    {
      id: 1,
      producerId: "1",
      titulo: "Tour Destilería Premium",
      tipo: "Turismo",
      descripcion:
        "Recorrido guiado por la destilería con degustación incluida y visita a barricas.",
      fecha: "2026-02-10",
      imagen:
        "https://images.unsplash.com/photo-1514361892635-eae31da6f09b?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 2,
      producerId: "1",
      titulo: "Cata Nocturna de Autor",
      tipo: "Evento",
      descripcion:
        "Cata exclusiva guiada por el maestro destilador con música en vivo.",
      fecha: "2026-03-02",
      imagen:
        "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 3,
      producerId: "2",
      titulo: "Ruta del Gin Artesanal",
      tipo: "Turismo",
      descripcion:
        "Experiencia sensorial recorriendo botánicos locales y procesos de destilación.",
      fecha: "2026-02-18",
      imagen:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 4,
      producerId: "3",
      titulo: "Festival de Destilados del Sur",
      tipo: "Evento",
      descripcion:
        "Encuentro anual con productores, música, foodtrucks y catas abiertas.",
      fecha: "2026-04-12",
      imagen:
        "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  /* =========================
     FILTRO POR DESTILERÍA
  ========================= */
  const events = useMemo(
    () => allEvents.filter((e) => String(e.producerId) === String(producerId)),
    [producerId]
  );

  return (
    <div className="events-wrap">
      <div className="events-header">
        <h1>Eventos & Turismo</h1>
        <p>Actividades exclusivas de esta destilería</p>

        <Link to={`/productores/${producerId}`} className="back-btn">
          ← Volver a la destilería
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty">
          No hay eventos o actividades turísticas registradas para esta destilería.
        </div>
      ) : (
        <div className="events-grid">
          {events.map((e) => (
            <div key={e.id} className="event-card">
              <div
                className="event-img"
                style={{ backgroundImage: `url(${e.imagen})` }}
              />
              <div className="event-body">
                <span className="event-type">{e.tipo}</span>
                <h3>{e.titulo}</h3>
                <p>{e.descripcion}</p>
                <div className="event-footer">
                  <span>📅 {e.fecha}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .events-wrap {
          padding: 18px;
        }

        .events-header {
          margin-bottom: 20px;
        }

        .events-header h1 {
          font-size: 26px;
          font-weight: 900;
          color: #111;
        }

        .events-header p {
          opacity: 0.75;
          margin-top: 4px;
        }

        .back-btn {
          display: inline-block;
          margin-top: 10px;
          font-weight: 800;
          text-decoration: none;
          color: #f28c28;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .event-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 16px 30px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
        }

        .event-img {
          height: 160px;
          background-size: cover;
          background-position: center;
        }

        .event-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event-type {
          font-size: 12px;
          font-weight: 900;
          color: #f28c28;
          text-transform: uppercase;
        }

        .event-body h3 {
          font-size: 18px;
          font-weight: 900;
          margin: 0;
        }

        .event-body p {
          font-size: 14px;
          opacity: 0.8;
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
      `}</style>
    </div>
  );
}
