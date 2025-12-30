import React from "react";
import { useParams, Link } from "react-router-dom";
import { cocktails, products } from "../data.js";

export default function CocktailDetail() {
  const { cocktailId } = useParams();
  const cocktail = cocktails.find((c) => c.id === cocktailId);

  if (!cocktail) {
    return (
      <div className="page">
        <p>Coctel no encontrado.</p>
      </div>
    );
  }

  const product = products.find((p) => p.id === cocktail.mainProductId);

  return (
    <div className="page">
      <section className="section">
        <h2>{cocktail.name}</h2>
        <p className="detail-sub">
          Destilado principal: {cocktail.mainSpiritType} · Intensidad:{" "}
          {cocktail.intensity}
        </p>
      </section>

      <div className="detail-block">
        <div className="detail-title">Ingredientes</div>
        <ul className="detail-list">
          {cocktail.ingredients.map((ing) => (
            <li key={ing}>• {ing}</li>
          ))}
        </ul>
      </div>

      <div className="detail-block">
        <div className="detail-title">Preparacion</div>
        <p className="description">{cocktail.preparation}</p>
      </div>

      {product && (
        <div className="detail-block">
          <div className="detail-title">Destilado sugerido</div>
          <p className="description">
            Este coctel se recomienda preparar con{" "}
            <Link to={`/skus/${product.id}`}>{product.name}</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
