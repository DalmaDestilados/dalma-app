import React from "react";
import { Link } from "react-router-dom";
import { cocktails, products } from "../data.js";

export default function CocktailsList() {
  return (
    <div className="page">
      <section className="section">
        <h2>Cocteles DALMA</h2>
        <p className="description">
          Lista de cocteles sugeridos por las destilerias (datos de prueba).
        </p>

        <div className="card-row">
          {cocktails.map((cocktail) => {
            const product = products.find(
              (p) => p.id === cocktail.mainProductId
            );
            return (
              <Link
                key={cocktail.id}
                to={`/cocteles/${cocktail.id}`}
                className="cocktail-card"
              >
                <div className="card-title">{cocktail.name}</div>
                <div className="card-sub">
                  Destilado: {cocktail.mainSpiritType} ·{" "}
                  {product ? product.name : ""}
                </div>
                <div className="badge">Intensidad: {cocktail.intensity}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
