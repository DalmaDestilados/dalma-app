import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CERRAR */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* IMAGEN */}
        {event.imagen_url && (
          <div
            className="modal-image"
            style={{
              backgroundImage: `url(${API_BASE}/${event.imagen_url})`,
            }}
          />
        )}

        {/* CONTENIDO */}
        <div className="modal-content">
          {event.categoria && (
            <span className="modal-category">
              {event.categoria}
            </span>
          )}

          <h2>{event.titulo}</h2>

          {event.descripcion && (
            <p className="modal-description">
              {event.descripcion}
            </p>
          )}

          <div className="modal-meta">
            {event.ubicacion && (
              <span>📍 {event.ubicacion}</span>
            )}
            {event.fecha && (
              <span>
                📅{" "}
                {new Date(event.fecha).toLocaleDateString("es-CL")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .modal-card {
          background: #fff;
          width: 100%;
          max-width: 420px;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.35);
          animation: modalIn 0.25s ease;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        @keyframes modalIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          z-index: 10;
        }

        .modal-image {
          height: 200px;
          background-size: cover;
          background-position: center;
        }

        .modal-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .modal-category {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          color: #f28c28;
        }

        .modal-content h2 {
          font-size: 20px;
          font-weight: 900;
          margin: 0;
        }

        .modal-description {
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.85;
        }

        .modal-meta {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}
