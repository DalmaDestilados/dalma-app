import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/auth.css";

function strongPassword(pw) {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [params] = useSearchParams();

  // 🔑 SOLO token (email NO es requerido por backend)
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      token &&
      strongPassword(newPassword) &&
      newPassword === repeat &&
      !loading
    );
  }, [token, newPassword, repeat, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) return setError("Link inválido o expirado.");
    if (!strongPassword(newPassword))
      return setError("Contraseña débil: mínimo 8 caracteres con letras y números.");
    if (newPassword !== repeat)
      return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      // ✅ BACKEND ESPERA SOLO token + password
      await resetPassword({ token, password: newPassword });
      setOk(true);
    } catch (e2) {
      setError(e2?.message || "No se pudo cambiar la contraseña.");
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
            <div className="auth-title">Nueva contraseña</div>
            <div className="auth-subtitle">Crea una contraseña segura</div>
          </div>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {ok ? (
          <div className="alert alert-success">
            Contraseña actualizada. Ya puedes iniciar sesión.
          </div>
        ) : null}

        {!ok ? (
          <form onSubmit={onSubmit} className="auth-form">
            <label className="field">
              <span>Nueva contraseña</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <small className="hint">
                Mínimo 8 caracteres, letras y números.
              </small>
            </label>

            <label className="field">
              <span>Repetir contraseña</span>
              <input
                type="password"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              />
              {repeat && newPassword !== repeat ? (
                <small className="hint">Las contraseñas no coinciden.</small>
              ) : null}
            </label>

            <button className="btn btn-primary" disabled={!canSubmit}>
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        ) : null}

        <div className="auth-links" style={{ marginTop: 10 }}>
          <Link to="/login" className="link-muted">
            Ir a iniciar sesión
          </Link>
          <Link to="/" className="link-muted">
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
