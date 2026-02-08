import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Landing() {
  return (
    <div className="auth-wrap landing">
      <div className="auth-bg" />

      <div className="auth-card auth-card-wide landing-card">
        {/* BRAND */}
        <div className="auth-brand landing-brand">
          <div className="auth-logo">D</div>
          <div>
            <div className="auth-title">DALMA</div>
            <div className="auth-subtitle">
              Destilerías, productos y cócteles
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="landing-hero">
          <h1>Explora y descubre en un solo lugar</h1>
          <p>
            Accede a la plataforma para explorar destilerías, productos y
            cócteles. Crea tu cuenta o regístrate como bartender profesional.
          </p>
        </div>

        {/* CTA */}
        <div className="landing-cta">
          <Link to="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>

          <Link to="/register" className="btn btn-ghost">
            Crear cuenta
          </Link>
        </div>

        <div className="landing-cta secondary">
          <Link to="/register?type=bartender" className="btn btn-secondary">
            Registrarme como Bartender (perfil pro)
          </Link>
        </div>

        {/* FOOTER */}
        <div className="landing-footer">
          <Link to="/forgot-password" className="link-muted">
            ¿Olvidaste tu contraseña?
          </Link>
          <span>Al continuar aceptas términos y políticas.</span>
        </div>
      </div>
    </div>
  );
}
