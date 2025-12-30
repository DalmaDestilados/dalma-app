import React from "react";
import { useParams, Link } from "react-router-dom";
import { producers, products, cocktails } from "../data.js";

export default function ProducerDetail() {
  const { producerId } = useParams();
  const producer = producers.find((p) => p.id === producerId);

  if (!producer) {
    return (
      <div className="page">
        <p>Destileria no encontrada.</p>
      </div>
    );
  }

  const producerProducts = products.filter((p) => p.producerId === producer.id);

  const producerCocktails = cocktails.filter((c) =>
    producerProducts.some((p) => p.id === c.mainProductId)
  );

  return (
    <div className="page">
      <div className="detail-header section">
        <h2>{producer.name}</h2>
        <p className="detail-sub">
          {producer.address} · {producer.region}
        </p>
      </div>

      <div className="detail-block">
        <div className="detail-title">Conocenos</div>
        <p className="description">{producer.description}</p>
        <ul className="detail-list">
          <li>
            {producer.hasShop ? "Cuenta" : "No cuenta"} con punto de venta
            propio
          </li>
          <li>
            {producer.hasTours ? "Cuenta" : "No cuenta"} con visitas turisticas
            guiadas
          </li>
          <li>Horario de atencion: {producer.schedule}</li>
        </ul>
      </div>

      <div className="detail-block">
        <div className="detail-title">Nuestros destilados</div>
        <div className="card-row">
          {producerProducts.map((product) => (
            <Link
              key={product.id}
              to={`/skus/${product.id}`}
              className="product-card"
            >
              <div className="card-title">{product.name}</div>
              <div className="card-sub">
                {product.type} · {product.abv}% abv · {product.volume} ml
              </div>
              <div className="rating-row">
                <span className="star">★</span>
                <span>
                  {product.rating.toFixed(1)} ({product.notesCount} notas)
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {producerCocktails.length > 0 && (
        <div className="detail-block">
          <div className="detail-title">Cocteles recomendados</div>
          <div className="card-row">
            {producerCocktails.map((cocktail) => (
              <Link
                key={cocktail.id}
                to={`/cocteles/${cocktail.id}`}
                className="cocktail-card"
              >
                <div className="card-title">{cocktail.name}</div>
                <div className="card-sub">
                  Destilado principal: {cocktail.mainSpiritType}
                </div>
                <div className="badge">Sensacion: {cocktail.intensity}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
