import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/auth.css";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function strongPassword(pw) {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}
function safeName(name) {
  return /^[A-Za-zÀ-ÿ\s'.-]{2,60}$/.test(name);
}
function safePhone(phone) {
  if (!phone) return true;
  return /^[+\d\s]{7,15}$/.test(phone);
}
function calcAgeFromBirthDate(birthDateStr) {
  const bd = new Date(birthDateStr);
  if (Number.isNaN(bd.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
  return age;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialType = params.get("type") === "bartender" ? "bartender" : "user";
  const [tipoCuenta, setTipoCuenta] = useState(initialType);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [region, setRegion] = useState("");
  const [confirm18, setConfirm18] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const age = useMemo(() => calcAgeFromBirthDate(fechaNacimiento), [fechaNacimiento]);
  const isAdult = useMemo(() => typeof age === "number" && age >= 18, [age]);

  const canSubmit = useMemo(() => {
    const baseOk =
      safeName(nombre.trim()) &&
      validateEmail(email.trim()) &&
      fechaNacimiento &&
      typeof age === "number" &&
      age >= 18 &&
      confirm18 &&
      strongPassword(password) &&
      password === repeatPassword &&
      safePhone(telefono.trim()) &&
      !loading;

    if (!baseOk) return false;

    if (tipoCuenta === "bartender") {
      return String(region).trim().length >= 2;
    }
    return true;
  }, [
    nombre, email, fechaNacimiento, age, confirm18,
    password, repeatPassword, telefono, loading, tipoCuenta, region,
  ]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanNombre = nombre.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanTelefono = telefono.trim();
    const cleanRegion = region.trim();

    setLoading(true);
    try {
      // Ahora usamos solo 'register' y enviamos tipoCuenta
      await register({
        nombre: cleanNombre,
        email: cleanEmail,
        password,
        fecha_nacimiento: fechaNacimiento,
        telefono: cleanTelefono || null,
        tipoCuenta: tipoCuenta, // 'user' o 'bartender'
        region: tipoCuenta === "bartender" ? cleanRegion : undefined
      });

      navigate("/verify-email", { replace: true, state: { email: cleanEmail, justRegistered: true } });
    } catch (err) {
      setError(err?.message || "No se pudo crear la cuenta.");
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
            <div className="auth-title">Crear cuenta</div>
            <div className="auth-subtitle">
              {tipoCuenta === "bartender" ? "Perfil bartender (pro)" : "Cuenta personal"}
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="field">
            <span>Tipo de registro *</span>
            <select value={tipoCuenta} onChange={(e) => setTipoCuenta(e.target.value)} className="select">
              <option value="user">Usuario</option>
              <option value="bartender">Bartender (perfil pro)</option>
            </select>
            {tipoCuenta === "bartender" && <small className="hint">Perfil bartender requiere ubicación y pago.</small>}
          </label>

          <label className="field"><span>Nombre *</span><input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" /></label>
          <label className="field"><span>Email *</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" /></label>
          <label className="field"><span>Fecha de nacimiento *</span><input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} /></label>
          <label className="check"><input type="checkbox" checked={confirm18} onChange={(e) => setConfirm18(e.target.checked)} disabled={!isAdult} /> <span>Confirmo que tengo 18 años o más</span></label>

          {tipoCuenta === "bartender" && <label className="field"><span>Región / Ubicación *</span><input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Ej: Coquimbo, Chile" /></label>}

          <label className="field"><span>Password *</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8, letras y números" /></label>
          <label className="field"><span>Repetir password *</span><input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Repite tu contraseña" /></label>
          <label className="field"><span>Teléfono (opcional)</span><input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" /></label>

          <button className="btn btn-primary" disabled={!canSubmit}>{loading ? "Creando..." : "Registrarme"}</button>
        </form>

        <div className="auth-links">
          <span>¿Ya tienes cuenta?</span> <Link to="/login">Iniciar sesión</Link>
        </div>
        <div className="auth-links" style={{ marginTop: 10 }}>
          <Link to="/" className="link-muted">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
}
