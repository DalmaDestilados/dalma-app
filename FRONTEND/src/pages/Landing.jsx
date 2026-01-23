import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Landing() {
  return (
    <div className="auth-wrap">
      <div className="auth-bg" />

      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <div className="auth-logo">D</div>
          <div>
            <div className="auth-title">DALMA</div>
            <div className="auth-subtitle">Destilerías, productos y cócteles</div>
          </div>
        </div>

        <div className="landing-hero">
          <h1>Explora y descubre en un solo lugar</h1>
          <p>
            Inicia sesión para acceder a la plataforma. Si no tienes cuenta, crea una.
            Si eres bartender, puedes registrarte en el perfil profesional.
          </p>
        </div>

        <div className="landing-actions">
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-ghost">Crear cuenta</Link>
        </div>

        <div className="landing-actions" style={{ marginTop: 10 }}>
          <Link to="/register?type=bartender" className="btn btn-secondary">
            Registrarme como Bartender (perfil pro)
          </Link>
        </div>

        <div className="landing-footer">
          <Link to="/forgot-password" className="link-muted">
            ¿Olvidaste tu contraseña?
          </Link>
          <span style={{ display: "block", marginTop: 8 }}>
            Al continuar aceptas términos y políticas.
          </span>
        </div>
      </div>
    </div>
  );
}
