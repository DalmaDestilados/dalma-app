import React from "react";
import { useParams, Link } from "react-router-dom";
import { products, producers, cocktails } from "../data.js";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="page">
        <p>Destilado no encontrado.</p>
      </div>
    );
  }

  const producer = producers.find((pr) => pr.id === product.producerId);
  const relatedCocktails = cocktails.filter(
    (c) => c.mainProductId === product.id
  );

  return (
    <div className="page">
      <section className="section">
        <h2>{product.name}</h2>
        <p className="detail-sub">
          {product.type} · {product.abv}% abv · {product.volume} ml ·{" "}
          {product.country}
        </p>
      </section>

      <div className="detail-block">
        <div className="detail-title">Resumen</div>
        <p className="description">{product.shortDescription}</p>
        <div className="rating-row">
          <span className="star">★</span>
          <span>
            {product.rating.toFixed(1)} ({product.notesCount} notas)
          </span>
        </div>
        <p className="note">
          Precio DALMA: ${product.price.toLocaleString()} ·{" "}
          {product.stock ? "Con stock disponible" : "Sin stock disponible"}
        </p>
        <div className="badge">Ver perfil productor</div>
        {producer && (
          <p className="small">
            Productor:{" "}
            <Link to={`/productores/${producer.id}`}>{producer.name}</Link>
          </p>
        )}
      </div>

      <div className="detail-block">
        <div className="detail-title">Notas de sabor</div>
        <ul className="detail-list">
          {product.flavorProfile.map((flavor) => (
            <li key={flavor}>• {flavor}</li>
          ))}
        </ul>
      </div>

      {relatedCocktails.length > 0 && (
        <div className="detail-block">
          <div className="detail-title">
            Cocteles sugeridos por el Maestro Destilador
          </div>
          <div className="card-row">
            {relatedCocktails.map((cocktail) => (
              <Link
                key={cocktail.id}
                to={`/cocteles/${cocktail.id}`}
                className="cocktail-card"
              >
                <div className="card-title">{cocktail.name}</div>
                <div className="card-sub">
                  Intensidad: {cocktail.intensity} · Mixologo:{" "}
                  {cocktail.mixologist}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
