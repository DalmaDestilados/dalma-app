import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminBartenders() {
  const navigate = useNavigate();

  const [perfilPropio, setPerfilPropio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre_publico: "",
    especialidad: "",
    descripcion: "",
    region: "",
    ciudad: "",
    instagram: "",
    email_contacto: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [bannerPerfil, setBannerPerfil] = useState(null);

  /* =========================
     CARGAR PERFIL
  ========================= */
  useEffect(() => {
    fetchMiPerfil();
  }, []);

  async function fetchMiPerfil() {
    try {
      const data = await apiFetch("/bartenders/me");
      setPerfilPropio(data);
      setForm({
        nombre_publico: data.nombre_publico || "",
        especialidad: data.especialidad || "",
        descripcion: data.descripcion || "",
        region: data.region || "",
        ciudad: data.ciudad || "",
        instagram: data.instagram || "",
        email_contacto: data.email_contacto || "",
      });
    } catch {
      setPerfilPropio(null);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  /* =========================
     GUARDAR PERFIL
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/bartenders/me", {
        method: perfilPropio ? "PUT" : "POST",
        body: JSON.stringify(form),
      });

      if (fotoPerfil || bannerPerfil) {
        const fd = new FormData();
        if (fotoPerfil) fd.append("foto_perfil", fotoPerfil);
        if (bannerPerfil) fd.append("banner_perfil", bannerPerfil);

        await apiFetch("/bartenders/me/upload", {
          method: "POST",
          body: fd,
        });
      }

      const actualizado = await apiFetch("/bartenders/me");
      setPerfilPropio(actualizado);

      navigate("/bartenders/me");
    } catch (err) {
      setError(err.message || "No se pudo guardar el perfil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bartender-wrap">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="back-btn"
      >
        ← Volver
      </button>

      <h2>
        {perfilPropio ? "Mi perfil bartender" : "Crear perfil bartender"}
      </h2>

      {error && <p className="bartender-error">{error}</p>}

      <form onSubmit={handleSubmit} className="bartender-form">
        <input
          name="nombre_publico"
          placeholder="Nombre público"
          value={form.nombre_publico}
          onChange={handleChange}
          required
        />

        <input
          name="especialidad"
          placeholder="Especialidad (ej: Coctelería clásica, Gin, Autor)"
          value={form.especialidad}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Cuéntanos sobre ti"
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <input
          name="region"
          placeholder="Región"
          value={form.region}
          onChange={handleChange}
        />

        <input
          name="ciudad"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={handleChange}
        />

        <input
          name="instagram"
          placeholder="Instagram"
          value={form.instagram}
          onChange={handleChange}
        />

        <input
          name="email_contacto"
          placeholder="Email de contacto"
          value={form.email_contacto}
          onChange={handleChange}
        />

        <label>Foto de perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFotoPerfil(e.target.files[0])}
        />

        <label>Banner del perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBannerPerfil(e.target.files[0])}
        />

        <button disabled={loading}>
          {loading
            ? "Guardando..."
            : perfilPropio
            ? "Actualizar perfil"
            : "Crear perfil"}
        </button>
      </form>

      {/* BOTÓN CREAR CÓCTEL */}
        {perfilPropio && (
          <button
            type="button"
            onClick={() => navigate("/mis-cocteles")}
            className="crear-coctel-btn"
          >
            🍸 Crear / Gestionar mis cócteles
          </button>
        )}


      <style>{`
        .bartender-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding: 20px 16px 120px;
        }

        h2 {
          text-align: center;
          color: #f28c28;
          margin-bottom: 14px;
          font-weight: 900;
        }

        .bartender-error {
          color: #e74c3c;
          text-align: center;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .bartender-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fff;
          padding: 20px;
          border-radius: 22px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.15);
        }

        .bartender-form input,
        .bartender-form textarea {
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .bartender-form textarea {
          min-height: 90px;
          resize: vertical;
        }

        .bartender-form label {
          font-size: 13px;
          font-weight: 800;
          margin-top: 6px;
          color: #333;
        }

        .bartender-form button {
          margin-top: 14px;
          padding: 14px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #f28c28, #ff9f43);
          color: #111;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(242,140,40,0.45);
        }

        .crear-coctel-btn {
          width: 100%;
          margin-top: 16px;
          padding: 14px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #111, #333);
          color: #fff;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .crear-coctel-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .back-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          margin-bottom: 10px;
          color: #111;
        }

        .back-btn:hover {
          opacity: 0.7;
        }

      `}</style>
    </div>
  );
}
