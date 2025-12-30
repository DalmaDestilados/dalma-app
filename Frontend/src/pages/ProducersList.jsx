import React from "react";
import { Link } from "react-router-dom";
import { producers, products } from "../data.js";

export default function ProducersList() {
  return (
    <div className="page">
      <section className="section">
        <h2>Destilerias en DALMA</h2>
        <p className="description">
          Catalogo de destilerias (datos de prueba para la demo).
        </p>

        <div className="card-row">
          {producers.map((producer) => {
            const countProducts = products.filter(
              (p) => p.producerId === producer.id
            ).length;

            return (
              <Link
                key={producer.id}
                to={`/productores/${producer.id}`}
                className="producer-card"
              >
                <div className="card-title">{producer.name}</div>
                <div className="card-sub">
                  {producer.region} · {countProducts} destilados
                </div>
                <div className="badge">Perfil productor</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
