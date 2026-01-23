import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/auth.css";

export default function VerifyEmail() {
  const { verifyEmail } = useAuth();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromLink = params.get("email") || "";
  const tokenFromLink = params.get("token") || "";
  const emailFromState = location.state?.email || "";

  const emailShow = useMemo(
    () => (emailFromLink || emailFromState || "").toLowerCase(),
    [emailFromLink, emailFromState]
  );

  const [status, setStatus] = useState("idle"); // idle | verifying | ok | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailFromLink && tokenFromLink) {
      (async () => {
        setStatus("verifying");
        setMessage("");
        try {
          // POST a /verify-email con tu AuthContext
          const msg = await verifyEmail({ email: emailFromLink, token: tokenFromLink });
          setStatus("ok");
          setMessage(msg || "Correo verificado correctamente. Ya puedes iniciar sesión.");

          // Redirige automáticamente al login después de 2 segundos
          setTimeout(() => navigate("/login"), 2000);
        } catch (e) {
          setStatus("error");
          setMessage(e?.message || "No se pudo verificar el correo.");
        }
      })();
    }
  }, [emailFromLink, tokenFromLink, verifyEmail, navigate]);

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <div className="auth-logo">D</div>
          <div>
            <div className="auth-title">Verificación de correo</div>
            <div className="auth-subtitle">Activa tu cuenta para poder iniciar sesión</div>
          </div>
        </div>

        {status === "verifying" && <div className="alert">Verificando tu correo...</div>}
        {message && (
          <div
            className={`alert ${
              status === "ok" ? "alert-success" : status === "error" ? "alert-error" : ""
            }`}
          >
            {message}
          </div>
        )}

        {!tokenFromLink && (
          <div style={{ marginTop: 10 }}>
            <p style={{ margin: 0 }}>
              Te enviamos un enlace de verificación a: <b>{emailShow || "(tu correo)"}</b>
            </p>
            <p className="hint" style={{ marginTop: 8 }}>
              Revisa tu bandeja de entrada y también spam. Abre el enlace para activar tu cuenta.
            </p>
          </div>
        )}

        <div className="landing-actions" style={{ marginTop: 16 }}>
          <Link to="/login" className="btn btn-primary">
            Ir a iniciar sesión
          </Link>
          <Link to="/" className="btn btn-ghost">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
