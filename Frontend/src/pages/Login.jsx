import { useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (data?.user) setUser(data.user);

      // redireccion simple (tu app ya tiene Home)
      window.location.href = "/";
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
            Inicio seguro (venta de licores) • validacion de edad legal
          </div>
        </div>

        <div className="dalma-auth-card pro">
          <div className="dalma-auth-card-title">Iniciar sesion</div>

          {/* Aviso legal / seguridad */}
          <div className="dalma-alert">
            <div className="dalma-alert-title">Aviso</div>
            <div className="dalma-alert-text">
              Por seguridad, el acceso esta restringido a mayores de edad. Si no cumples la edad legal,
              el sistema bloqueara el ingreso automaticamente.
            </div>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <label className="dalma-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="dalma-input"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />

            <label className="dalma-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="dalma-input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="********"
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="dalma-error" role="alert">
                {error}
              </div>
            )}

            <button className="dalma-btn" disabled={loading} type="submit">
              {loading ? "Ingresando..." : "Iniciar sesion"}
            </button>

            <div className="dalma-auth-footer">
              No tienes cuenta? <a href="/register">Registrate</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
