import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    "dalma-bottom-link" + (isActive ? " is-active" : "");

  function goToSearch() {
    navigate("/home", { state: { focusSearch: true } });
  }

  const isBartenderOrAdmin =
    user && (user.rol === 2 || user.rol === 3);

  return (
    <nav className="dalma-bottom-nav" aria-label="Navegacion inferior">
      {/* INICIO */}
      <NavLink to="/home" className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">⌂</span>
        <span className="dalma-bottom-label">Inicio</span>
      </NavLink>

      {/* BUSCAR */}
      <button
        type="button"
        onClick={goToSearch}
        className="dalma-bottom-link"
        style={{ background: "none", border: "none" }}
      >
        <span className="dalma-bottom-icon" aria-hidden="true">🔍</span>
        <span className="dalma-bottom-label">Buscar</span>
      </button>

      {/* CARRITO */}
      <NavLink to="/carrito" className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">🛒</span>
        <span className="dalma-bottom-label">Carrito</span>
      </NavLink>

      {/* PERFIL USUARIO */}
      <NavLink to={user ? "/profile" : "/login"} className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">👤</span>
        <span className="dalma-bottom-label">Cuenta</span>
      </NavLink>

      
    </nav>
  );
}
