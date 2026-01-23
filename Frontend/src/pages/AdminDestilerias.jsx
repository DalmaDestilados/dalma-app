import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function AdminDestilerias() {
  const [destilerias, setDestilerias] = useState([]);
  const [form, setForm] = useState({
    nombre_comercial: "",
    descripcion: "",
    logo_url: "",
    email_contacto: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "",
    sitio_web: "",
    activo: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDestilerias();
  }, []);

  async function fetchDestilerias() {
    try {
      const data = await apiFetch("/destilerias");
      setDestilerias(data);
    } catch {
      setError("No se pudieron cargar las destilerías (¿rol admin?)");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingId) {
        await apiFetch(`/destilerias/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/destilerias", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      await fetchDestilerias();
      setEditingId(null);
      setForm({
        nombre_comercial: "",
        descripcion: "",
        logo_url: "",
        email_contacto: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        pais: "",
        sitio_web: "",
        activo: 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(d) {
  setEditingId(d.id_destileria);
  setForm({
    nombre_comercial: d.nombre_comercial || "",
    descripcion: d.descripcion || "",
    logo_url: d.logo_url || "",
    email_contacto: d.email_contacto || "",
    telefono: d.telefono || "",
    direccion: d.direccion || "",
    ciudad: d.ciudad || "",
    pais: d.pais || "",
    sitio_web: d.sitio_web || "",
    activo: d.activo ?? 1,
  });
}

  async function handleDelete(id) {
    if (!confirm("¿Seguro que quieres eliminar esta destilería?")) return;

    try {
      await apiFetch(`/destilerias/${id}`, { method: "DELETE" });
      await fetchDestilerias();
    } catch {
      setError("No se pudo eliminar la destilería");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="admin-wrap">
      <h2 className="admin-title">Administrar Destilerías</h2>
      {error && <p className="admin-error">{error}</p>}

      {/* FORM */}
      <form className="admin-form" onSubmit={handleSave}>
        <input name="nombre_comercial" placeholder="Nombre comercial" value={form.nombre_comercial} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="logo_url" placeholder="URL logo" value={form.logo_url} onChange={handleChange} />
        <input name="email_contacto" placeholder="Email contacto" value={form.email_contacto} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
        <input name="pais" placeholder="País" value={form.pais} onChange={handleChange} />
        <input name="sitio_web" placeholder="Sitio web" value={form.sitio_web} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar destilería" : "Crear destilería"}
        </button>
      </form>

      {/* LISTA */}
      <div className="admin-list">
        {destilerias.map(d => (
          <div key={d.id_destileria} className="admin-card">
            <strong>{d.nombre_comercial}</strong>
            <span>{d.ciudad}, {d.pais}</span>

            <div className="admin-actions">
              <button onClick={() => handleEdit(d)}>Editar</button>
              <button className="danger" onClick={() => handleDelete(d.id_destileria)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ESTILOS */}
      <style>{`
        .admin-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
        }

        .admin-title {
          margin-bottom: 16px;
        }

        .admin-error {
          color: red;
          margin-bottom: 12px;
        }

        .admin-form {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
          margin-bottom: 30px;
        }

        .admin-form input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        .admin-form button {
          grid-column: 1 / -1;
          padding: 12px;
          border-radius: 999px;
          border: none;
          background: #f28c28;
          font-weight: 900;
          cursor: pointer;
        }

        .admin-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .admin-card {
          border: 1px solid #ddd;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .admin-actions button {
          flex: 1;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
        }

        .admin-actions .danger {
          background: #e74c3c;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
