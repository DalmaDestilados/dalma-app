import React from "react";
import { useAuth } from "../AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="page page-center">
      <div className="auth-card">
        <h2>Perfil de usuario</h2>
        {user ? (
          <>
            <p className="description">
              Sesion iniciada como <strong>{user.email}</strong>
            </p>
            <button className="btn-secondary" onClick={logout}>
              Cerrar sesion
            </button>
          </>
        ) : (
          <p>No hay usuario logueado.</p>
        )}
      </div>
    </div>
  );
}
