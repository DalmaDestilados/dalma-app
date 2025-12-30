import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { products, producers } from "../data.js";

function matchesSearchAndCategory({ searchTerm, category, product, producer }) {
  const s = searchTerm.trim().toLowerCase();

  const matchText =
    !s ||
    product.name.toLowerCase().includes(s) ||
    product.type.toLowerCase().includes(s) ||
    (producer?.name || "").toLowerCase().includes(s);

  const matchCategory =
    category === "Todos"
      ? true
      : product.type.toLowerCase() === category.toLowerCase();

  return matchText && matchCategory;
}

export default function Home({ searchTerm, category }) {
  const bestRated = useMemo(() => {
    const filtered = products.filter((p) => {
      const pr = producers.find((x) => x.id === p.producerId);
      return matchesSearchAndCategory({
        searchTerm,
        category,
        product: p,
        producer: pr,
      });
    });

    return [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [searchTerm, category]);

  const newReleases = useMemo(() => {
    // Simula "Nuevos destilados" con los ultimos 4
    return [...products].slice(-4).reverse();
  }, []);

  const masters = useMemo(
    () => [
      { id: "m1", name: "Maestro Destilador", role: "Productor", tag: "Pisco" },
      { id: "m2", name: "Maestro Mixologo", role: "Mixologia", tag: "Gin" },
      {
        id: "m3",
        name: "Maestra Destiladora",
        role: "Productor",
        tag: "Whisky",
      },
      { id: "m4", name: "Maestro Mixologo", role: "Mixologia", tag: "Vodka" },
    ],
    []
  );

  return (
    <div className="dalma-home">
      {/* NUEVOS DESTILADOS */}
      <section className="dalma-section">
        <div className="dalma-section-title">Nuevos destilados</div>

        <div className="dalma-feed">
          {newReleases.map((p) => {
            const pr = producers.find((x) => x.id === p.producerId);
            return (
              <Link key={p.id} to={`/skus/${p.id}`} className="dalma-feed-item">
                <div className="dalma-thumb" aria-hidden="true" />
                <div className="dalma-feed-text">
                  <div className="dalma-feed-name">{p.name}</div>
                  <div className="dalma-feed-sub">
                    {pr?.name} · {p.type}
                  </div>
                  <div className="dalma-feed-meta">
                    <span className="dalma-star">★</span>
                    {p.rating.toFixed(1)} · ${p.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ACCESOS */}
      <section className="dalma-section">
        <div className="dalma-quick-grid">
          <div className="dalma-quick-card">
            <div className="dalma-quick-title">Eventos & Turismo</div>
            <div className="dalma-quick-sub">
              Actividades y visitas de destilerias clientes.
            </div>
            <Link className="dalma-quick-btn" to="/productores">
              Ver destilerias →
            </Link>
          </div>

          <div className="dalma-quick-card">
            <div className="dalma-quick-title">Prepara tu coctel</div>
            <div className="dalma-quick-sub">
              Recetas sugeridas por productores y mixologos.
            </div>
            <Link className="dalma-quick-btn" to="/cocteles">
              Ver cocteles →
            </Link>
          </div>

          <div className="dalma-quick-card">
            <div className="dalma-quick-title">Buscador rapido</div>
            <div className="dalma-quick-sub">
              Busca por marca o tipo (Pisco, Gin, etc.).
            </div>
            <div className="dalma-quick-hint">Usa el buscador de arriba.</div>
          </div>
        </div>
      </section>

      {/* MEET THE BEST */}
      <section className="dalma-section">
        <div className="dalma-section-title orange">meet the best!</div>

        <div className="dalma-marquee">
          {bestRated.map((p) => {
            const pr = producers.find((x) => x.id === p.producerId);
            return (
              <Link key={p.id} to={`/skus/${p.id}`} className="dalma-best-card">
                <div className="dalma-bottle" aria-hidden="true" />
                <div className="dalma-best-name">{p.name}</div>
                <div className="dalma-best-sub">{pr?.name}</div>
                <div className="dalma-best-meta">
                  <span className="dalma-star">★</span>
                  {p.rating.toFixed(1)} · {p.type}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MEET THE MASTERS */}
      <section className="dalma-section">
        <div className="dalma-section-title orange">meet the masters!</div>

        <div className="dalma-masters">
          {masters.map((m) => (
            <div key={m.id} className="dalma-master-card">
              <div className="dalma-avatar" aria-hidden="true" />
              <div className="dalma-master-name">{m.name}</div>
              <div className="dalma-master-sub">
                {m.role} · {m.tag}
              </div>
              <div className="dalma-master-line" />
            </div>
          ))}
        </div>
      </section>

      {/* RESULTADOS (cuando buscas) */}
      {searchTerm.trim() && (
        <section className="dalma-section">
          <div className="dalma-section-title">Resultados</div>

          <div className="dalma-feed">
            {products
              .filter((p) => {
                const pr = producers.find((x) => x.id === p.producerId);
                return matchesSearchAndCategory({
                  searchTerm,
                  category,
                  product: p,
                  producer: pr,
                });
              })
              .map((p) => {
                const pr = producers.find((x) => x.id === p.producerId);
                return (
                  <Link
                    key={p.id}
                    to={`/skus/${p.id}`}
                    className="dalma-feed-item"
                  >
                    <div className="dalma-thumb" aria-hidden="true" />
                    <div className="dalma-feed-text">
                      <div className="dalma-feed-name">{p.name}</div>
                      <div className="dalma-feed-sub">
                        {pr?.name} · {p.type}
                      </div>
                      <div className="dalma-feed-meta">
                        <span className="dalma-star">★</span>
                        {p.rating.toFixed(1)} · ${p.price.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
