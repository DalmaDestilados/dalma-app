import { useMemo, useState } from "react";
import { apiFetch } from "../api";

const MIN_LEGAL_AGE = 18;

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    repeatPassword: "",
    edad: "",
    rol: "usuario",
    telefono: "",
  });

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validationMsg = useMemo(() => {
    if (!form.nombre || form.nombre.trim().length < 2) return "El nombre es obligatorio (minimo 2 caracteres).";
    if (!form.email) return "El email es obligatorio.";
    if (!form.password || form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (form.repeatPassword !== form.password) return "Las contraseñas no coinciden.";

    const edadNum = Number(form.edad);
    if (!Number.isInteger(edadNum) || edadNum < 0 || edadNum > 120) return "Edad invalida.";
    if (edadNum < MIN_LEGAL_AGE) return `Debes tener al menos ${MIN_LEGAL_AGE} anos para registrarte.`;

    const rol = String(form.rol || "").toLowerCase();
    if (!["usuario", "bartender"].includes(rol)) return "Rol invalido (usuario o bartender).";

    if (form.telefono && !/^[0-9+\-\s()]{6,20}$/.test(form.telefono)) {
      return "Telefono invalido. Usa solo numeros y simbolos basicos (+ - espacio parentesis).";
    }

    return "";
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          edad: Number(form.edad),
          rol: form.rol,
          telefono: form.telefono ? form.telefono.trim() : null,
        }),
      });

      setOk(data?.message || "Registro exitoso. Ahora inicia sesion.");
      setForm({
        nombre: "",
        email: "",
        password: "",
        repeatPassword: "",
        edad: "",
        rol: "usuario",
        telefono: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dalma-auth-page">
      <div className="dalma-auth-shell">
        <div className="dalma-auth-brand">
          <div className="dalma-auth-title" style={{ color: "var(--dalma-orange)" }}>
            DALMA
          </div>
          <div className="dalma-auth-subtitle">
            Registro seguro • edad legal • rol de acceso
          </div>
        </div>

        <div className="dalma-auth-card pro">
          <div className="dalma-auth-card-title">Crear cuenta</div>

          <div className="dalma-alert">
            <div className="dalma-alert-title">Requisitos</div>
            <div className="dalma-alert-text">
              Debes ser mayor de edad para registrarte. El rol define tu acceso (usuario o bartender).
            </div>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <label className="dalma-label" htmlFor="nombre">Nombre *</label>
            <input
              id="nombre"
              className="dalma-input"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              placeholder="Tu nombre"
              required
            />

            <label className="dalma-label" htmlFor="email">Email *</label>
            <input
              id="email"
              className="dalma-input"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="tu@email.com"
              required
            />

            <label className="dalma-label" htmlFor="password">Password *</label>
            <input
              id="password"
              className="dalma-input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Minimo 8 caracteres"
              required
            />

            <label className="dalma-label" htmlFor="repeatPassword">Repetir password * (solo frontend)</label>
            <input
              id="repeatPassword"
              className="dalma-input"
              type="password"
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={onChange}
              placeholder="Repite tu password"
              required
            />

            <label className="dalma-label" htmlFor="edad">Edad *</label>
            <input
              id="edad"
              className="dalma-input"
              type="number"
              name="edad"
              min="0"
              max="120"
              value={form.edad}
              onChange={onChange}
              placeholder="18+"
              required
            />

            <label className="dalma-label" htmlFor="rol">Rol *</label>
            <select
              id="rol"
              className="dalma-input"
              name="rol"
              value={form.rol}
              onChange={onChange}
              required
            >
              <option value="usuario">usuario</option>
              <option value="bartender">bartender</option>
            </select>

            <label className="dalma-label" htmlFor="telefono">Telefono (opcional)</label>
            <input
              id="telefono"
              className="dalma-input"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              placeholder="+56 9 1234 5678"
            />

            {error && (
              <div className="dalma-error" role="alert">
                {error}
              </div>
            )}

            {ok && (
              <div className="dalma-alert" style={{ borderColor: "rgba(0,0,0,0.12)", background: "rgba(242,140,40,0.10)" }}>
                <div className="dalma-alert-title">Listo</div>
                <div className="dalma-alert-text">{ok}</div>
              </div>
            )}

            <button className="dalma-btn" disabled={loading} type="submit">
              {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <div className="dalma-auth-footer">
              Ya tienes cuenta? <a href="/login">Iniciar sesion</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
