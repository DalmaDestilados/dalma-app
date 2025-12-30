import React, { useMemo, useState } from "react";

const CATEGORIES = ["Pisco", "Gin", "Whisky", "Vodka", "Licores", "Otros"];

export default function Header({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = useMemo(() => ["Todos", ...CATEGORIES], []);

  return (
    <header className="dalma-header">
      <div className="dalma-header-top">
        <button
          className="dalma-menu-btn"
          onClick={() => setOpenMenu((v) => !v)}
          aria-label="Menu"
          type="button"
        >
          <span className="dalma-menu-lines" />
        </button>

        <div className="dalma-brand">
          <div className="dalma-logo-box">LOGO</div>
        </div>

        <div className="dalma-header-spacer" />
      </div>

      {openMenu && (
        <div className="dalma-menu-panel">
          <div className="dalma-menu-title">Categorias</div>
          <div className="dalma-menu-items">
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`dalma-menu-item ${
                  category === item ? "is-active" : ""
                }`}
                onClick={() => {
                  setCategory(item);
                  setOpenMenu(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dalma-header-search">
        <div className="dalma-search-box">
          <input
            className="dalma-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por marca o tipo de destilado..."
          />
          <span className="dalma-search-icon" aria-hidden="true">
            🔍
          </span>
        </div>

        <select
          className="dalma-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Todos">Todos</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="dalma-orange-line" />
    </header>
  );
}
