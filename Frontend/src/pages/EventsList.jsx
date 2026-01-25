import React from "react";
import { Link } from "react-router-dom";

export default function EventsList() {
  const events = [
    {
      id: 1,
      title: "Festival del Pisco Artesanal",
      subtitle: "Valle del Elqui · Degustación & Cultura",
      image:
        "https://images.unsplash.com/photo-1514361892635-eae31da6f09b?auto=format&fit=crop&w=1400&q=80",
      description:
        "Un encuentro único donde las mejores destilerías artesanales presentan sus piscos premium. Degustaciones guiadas, música en vivo y gastronomía local.",
      date: "12 de Abril, 2026",
      location: "Valle del Elqui, Chile",
    },
    {
      id: 2,
      title: "Ruta del Gin Patagónico",
      subtitle: "Turismo & Naturaleza",
      image:
        "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1400&q=80",
      description:
        "Recorre destilerías del sur de Chile y descubre gin botánico elaborado con ingredientes nativos. Una experiencia turística inmersiva.",
      date: "3 de Mayo, 2026",
      location: "Patagonia Chilena",
    },
    {
      id: 3,
      title: "Noche de Barricas & Whisky",
      subtitle: "Evento nocturno exclusivo",
      image:
        "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1400&q=80",
      description:
        "Una noche privada para conocer procesos de añejamiento, barricas y degustar whiskys premium guiados por maestros destiladores.",
      date: "20 de Junio, 2026",
      location: "Santiago",
    },
    {
      id: 4,
      title: "Sabores del Sur",
      subtitle: "Licorería & Tradición",
      image:
        "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1400&q=80",
      description:
        "Feria abierta con licores tradicionales del sur de Chile, gastronomía típica y presentaciones culturales.",
      date: "15 de Julio, 2026",
      location: "Valdivia",
    },
  ];

  return (
    <div className="events-wrap">
      {/* HEADER */}
      <header className="events-header">
        <h1>Eventos & Turismo</h1>
        <p>
          Descubre experiencias, degustaciones y rutas turísticas organizadas
          por destilerías de todo Chile.
        </p>
      </header>

      {/* LISTADO */}
      <section className="events-grid">
        {events.map((e) => (
          <article key={e.id} className="event-card">
            <div
              className="event-image"
              style={{ backgroundImage: `url(${e.image})` }}
            />

            <div className="event-content">
              <span className="event-subtitle">{e.subtitle}</span>
              <h2>{e.title}</h2>

              <p className="event-description">{e.description}</p>

              <div className="event-meta">
                <span>📍 {e.location}</span>
                <span>📅 {e.date}</span>
              </div>

              <Link to="/productores" className="event-btn">
                Ver destilerías relacionadas
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* ESTILOS */}
      <style>{`
        .events-wrap {
          padding: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .events-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .events-header h1 {
          font-size: 28px;
          font-weight: 1000;
          color: var(--dalma-orange);
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
          display: flex;
          flex-direction: column;
          transition: transform .2s ease;
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-image {
          height: 180px;
          background-size: cover;
          background-position: center;
        }

        .event-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .event-subtitle {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(0,0,0,0.55);
        }

        .event-content h2 {
          font-size: 18px;
          font-weight: 900;
          color: #000;
        }

        .event-description {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0,0,0,0.75);
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(0,0,0,0.7);
        }

        .event-btn {
          margin-top: 10px;
          align-self: flex-start;
          background: var(--dalma-orange);
          color: #000;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 900;
          text-decoration: none;
          transition: background .2s ease;
        }

        .event-btn:hover {
          background: #ffa733;
        }

        @media (max-width: 480px) {
          .events-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
