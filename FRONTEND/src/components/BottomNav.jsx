import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function BottomNav() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    "dalma-bottom-link" + (isActive ? " is-active" : "");

  return (
    <nav className="dalma-bottom-nav" aria-label="Navegacion inferior">
      <NavLink to="/home" className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">
          ⌂
        </span>
        <span className="dalma-bottom-label">Inicio</span>
      </NavLink>

      <NavLink to="/buscar" className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">
          🔍
        </span>
        <span className="dalma-bottom-label">Buscar</span>
      </NavLink>

      <NavLink to="/carrito" className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">
          🛒
        </span>
        <span className="dalma-bottom-label">Carrito</span>
      </NavLink>

      <NavLink to={user ? "/profile" : "/login"} className={linkClass}>
        <span className="dalma-bottom-icon" aria-hidden="true">
          👤
        </span>
        <span className="dalma-bottom-label">Perfil</span>
      </NavLink>
    </nav>
  );
}
