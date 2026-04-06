import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const API_BASE =
  import.meta.env.VITE_API_BASE 

export default function Header({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, booting } = useAuth();

  const isHome = location.pathname === "/home";

  // Rutas donde el buscador está activo
  const isProducerList = location.pathname === "/productores";
  const isProductList =
    location.pathname === "/productos" ||
    /^\/productores\/\d+\/productos$/.test(location.pathname) ||
    location.pathname === "/skus";

  // Ocultar solo el buscador
  const hideHeaderSearch =
    !(isProducerList || isProductList) &&
    (
      location.pathname === "/cocteles" ||
      /^\/cocteles\/\d+/.test(location.pathname) ||
      /^\/productores\/\d+/.test(location.pathname) ||
      /^\/productos\/\d+/.test(location.pathname) ||
      location.pathname === "/profile" ||
      location.pathname.startsWith("/admin")
    );

  const categories = useMemo(
    () => ["Todos", "Pisco", "Gin", "Whisky", "Vodka", "Ron", "Licores", "Otros"],
    []
  );

  function go(path) {
    setOpen(false);
    navigate(path);
  }

  function pickCategory(cat) {
    setCategory(cat);
    setOpen(false);
    if (!isHome) navigate("/home");
  }

  // ROLES
  const esAdmin = !booting && user?.rol === 3;
  const esBartender = !booting && user?.rol === 2;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="dalma-header">
        <div className="dalma-logo" onClick={() => go("/home")}>
          <svg viewBox="0 0 400 120" aria-label="Dalma logo">
            <text
              x="200"
              y="62"
              textAnchor="middle"
              fill="white"
              fontSize="72"
              fontFamily="'Brush Script MT', 'Segoe Script', cursive"
            >
              Dalma
            </text>
            <text
              x="200"
              y="98"
              textAnchor="middle"
              fill="rgba(255,255,255,0.85)"
              fontSize="20"
              letterSpacing="3"
              fontFamily="system-ui, sans-serif"
            >
              GUÍA DE DESTILADOS
            </text>
          </svg>
        </div>

        {/* PERFIL USUARIO */}
        {user && (
          <div
            className="dalma-user"
            onClick={() => navigate("/profile")}
          >
            <div className="dalma-avatar">
              {user.foto_perfil ? (
                <img
                  src={`${API_BASE}/${user.foto_perfil}`}
                  alt="avatar"
                />
              ) : (
                <span>{user.nombre?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="dalma-username">{user.nombre}</span>
          </div>
        )}
      </header>

      {/* ================= SEARCH ================= */}
      <div className="dalma-search-wrap">
        <button className="dalma-burger" onClick={() => setOpen(true)}>
          <span />
          <span />
          <span />
        </button>

        {!hideHeaderSearch && (
          <div className="dalma-search">
            <span className="dalma-search-ico">🔍</span>
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {open && <div className="dalma-overlay" onClick={() => setOpen(false)} />}

      {/* ================= DRAWER ================= */}
      <aside className={`dalma-drawer ${open ? "open" : ""}`}>
        <button onClick={() => go("/home")}>🏠 Inicio</button>
        <button onClick={() => go("/productores")}>🏭 Destilerías</button>
        <button onClick={() => go("/productos")}>🧴 Productos</button>

        {/* ===== ADMIN ===== */}
        {esAdmin && (
          <>
            <button
              className="dalma-admin-btn"
              onClick={() => go("/admin/destilerias")}
            >
              🛠️ Gestionar Destilerías
            </button>

            <button
              className="dalma-admin-btn"
              onClick={() => go("/admin/productos")}
            >
              🛠️ Gestionar Productos
            </button>

            <button
              className="dalma-admin-btn"
              onClick={() => go("/admin/eventos")}
            >
              🛠️ Gestionar Eventos
            </button>

            <button
              className="dalma-admin-btn"
              onClick={() => go("/admin/bartenders")}
            >
              🍸 Gestionar Bartenders
            </button>
          </>
        )}

        {/* ===== BARTENDER ===== */}
        {esBartender && (
          <button
            className="dalma-admin-btn"
            onClick={() => go("/bartenders/me")}
          >
            🍸 Mi perfil bartender
          </button>
        )}

        {/* ===== CATEGORÍAS ===== */}
        <div className="dalma-drawer-categories">
          <strong>Categorías</strong>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => pickCategory(c)}
              className={`dalma-cat-btn ${category === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </aside>

      {/* ================= STYLES ================= */}
      <style>{`
.dalma-header {
  background: #000;
  padding: 18px 16px 12px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
}

.dalma-logo {
  grid-column: 2;
  width: 260px;
  cursor: pointer;
  justify-self: center;
}

.dalma-user {
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.dalma-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg,#f28c28,#ffb066,#f28c28);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dalma-avatar img,
.dalma-avatar span {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f28c28;
  color: #111;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dalma-username {
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.dalma-search-wrap {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  padding: 14px;
  background: #fff;
}

.dalma-burger {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1.5px solid #000;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.dalma-burger span {
  width: 18px;
  height: 2px;
  background: #000;
}

.dalma-search {
  background: #f5e3d3;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  gap: 10px;
}

.dalma-search input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
}

.dalma-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 90;
}

.dalma-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #111;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  z-index: 100;
}

.dalma-drawer.open {
  transform: translateX(0);
}

.dalma-drawer button {
  background: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 12px 14px;
  color: #fff;
  font-weight: 700;
  text-align: left;
}

.dalma-admin-btn {
  background: #f28c28 !important;
  color: #111 !important;
  font-weight: 900;
}

.dalma-drawer-categories {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #fff;
}

.dalma-cat-btn {
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  padding: 8px 12px;
  border: none;
  color: #fff;
}

.dalma-cat-btn.active {
  background: #f28c28;
  color: #111;
  font-weight: 900;
}
`}</style>
    </>
  );
}
