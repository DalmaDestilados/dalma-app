import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ opacity: 0.8 }}>Cargando…</div>
      </div>
    );
  }

  if (!isAuthed) {
    // guardamos la ruta completa (pathname + search) para volver bien
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return children;
}
