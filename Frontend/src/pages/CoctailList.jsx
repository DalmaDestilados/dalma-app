import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function CoctailList() {
  const [cocteles, setCocteles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(null); // nombre | destilado | ingrediente

  useEffect(() => {
    // ✅ RUTA PÚBLICA CORRECTA
    fetch("http://localhost:3001/api/cocteles/public")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar cócteles");
        return res.json();
      })
      .then((data) => setCocteles(data || []))
      .catch((err) => {
        console.error("Error cargando cócteles", err);
        setCocteles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===========================
     FILTRO REAL (FIX)
  =========================== */
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return cocteles;

    return cocteles.filter((c) => {
      const ingredientesText = String(c.ingredientes || "").toLowerCase();

      if (searchMode === "nombre") {
        return c.nombre?.toLowerCase().includes(s);
      }

      if (searchMode === "destilado") {
        return c.destilado_principal?.toLowerCase().includes(s);
      }

      if (searchMode === "ingrediente") {
        return ingredientesText.includes(s);
      }

      return (
        `${c.nombre} ${c.destilado_principal || ""} ${ingredientesText}`
          .toLowerCase()
          .includes(s)
      );
    });
  }, [search, searchMode, cocteles]);

  /* ===========================
     RESALTADO
  =========================== */
  function highlight(text) {
    if (!search || !text) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark
          key={i}
          style={{
            background: "#f28c28",
            color: "#000",
            padding: "0 2px",
            borderRadius: 4,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando cócteles…</div>;
  }

  return (
    <div style={{ background: "#fff6ef", minHeight: "100vh" }}>
      {/* BUSCADORES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b)",
            backgroundSize: "cover",
            borderRadius: 14,
            height: 140,
            position: "relative",
          }}
          onClick={() => setSearchMode("destilado")}
        >
          <button
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              background: searchMode === "destilado" ? "#000" : "#f28c28",
              color: searchMode === "destilado" ? "#fff" : "#000",
              border: "none",
              padding: "10px 18px",
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            Buscar por destilado
          </button>
        </div>

        <div
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836)",
            backgroundSize: "cover",
            borderRadius: 14,
            height: 140,
            position: "relative",
          }}
          onClick={() => setSearchMode("ingrediente")}
        >
          <button
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              background: searchMode === "ingrediente" ? "#000" : "#f28c28",
              color: searchMode === "ingrediente" ? "#fff" : "#000",
              border: "none",
              padding: "10px 18px",
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            Buscar por ingrediente
          </button>
        </div>
      </div>

      {/* INPUT */}
      <div style={{ padding: "0 16px 12px" }}>
        <input
          type="text"
          placeholder={
            searchMode ? `Buscar por ${searchMode}` : "Buscar cóctel"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* LISTA */}
      <div style={{ padding: "0 16px 24px" }}>
        {filtered.map((c) => (
          <Link
            key={c.id_coctel}
            to={`/cocteles/${c.id_coctel}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                background: "#ffe1c8",
                borderRadius: 10,
                padding: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  background: c.imagen_url
                    ? `url(http://localhost:3001/${c.imagen_url})`
                    : "linear-gradient(135deg,#eee,#ddd)",
                  backgroundSize: "cover",
                }}
              />

              <div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Nombre del Mixólogo creador
                </div>

                <div style={{ fontWeight: 700 }}>
                  {highlight(c.nombre)}
                </div>

                <div style={{ fontSize: 13 }}>
                  {searchMode === "ingrediente"
                    ? highlight(c.ingredientes)
                    : highlight(c.destilado_principal)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
