import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/auth.css";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => validateEmail(email.trim()) && !loading, [email, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const clean = email.trim().toLowerCase();
    if (!validateEmail(clean)) return setError("Ingresa un correo válido.");

    setLoading(true);
    try {
      // ✅ Enviamos solo el string de email, no un objeto
      await forgotPassword(clean);
      setDone(true);
    } catch (e2) {
      setError(e2?.message || "No se pudo procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <div className="auth-logo">D</div>
          <div>
            <div className="auth-title">Recuperar contraseña</div>
            <div className="auth-subtitle">Te enviaremos un enlace a tu correo</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {done && (
          <div className="alert alert-success">
            Si el correo existe, enviaremos un enlace de recuperación. Revisa tu bandeja de entrada y spam.
          </div>
        )}

        {!done && (
          <form onSubmit={onSubmit} className="auth-form">
            <label className="field">
              <span>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
              />
            </label>

            <button className="btn btn-primary" disabled={!canSubmit}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <div className="auth-links" style={{ marginTop: 10 }}>
          <Link to="/login" className="link-muted">
            Volver a iniciar sesión
          </Link>
          <Link to="/" className="link-muted">
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
