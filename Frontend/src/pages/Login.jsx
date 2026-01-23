import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/auth.css";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/Home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => validateEmail(email.trim()) && password.length >= 6 && !loading,
    [email, password, loading]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) return setError("Ingresa un correo válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    setLoading(true);
    try {
      await login({ email: cleanEmail, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">D</div>
          <div>
            <div className="auth-title">Bienvenido</div>
            <div className="auth-subtitle">Ingresa para continuar</div>
          </div>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="btn btn-primary" disabled={!canSubmit}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-links" style={{ justifyContent: "space-between" }}>
          <span>¿No tienes cuenta?</span> <Link to="/register">Crear cuenta</Link>
        </div>

        <div className="auth-links" style={{ marginTop: 10, justifyContent: "space-between" }}>
          <Link to="/forgot-password" className="link-muted">Olvidé mi contraseña</Link>
          <Link to="/" className="link-muted">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
