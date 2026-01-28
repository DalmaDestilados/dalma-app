import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDestilerias() {
  const [destilerias, setDestilerias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // FORM DATA
  const [form, setForm] = useState({
    nombre_comercial: "",
    descripcion: "",
    email_contacto: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "",
    sitio_web: "",
    activo: 1,
  });

  // FILES
  const [logoFile, setLogoFile] = useState(null);
  const [personaFile, setPersonaFile] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);

  // PERSONA
  const [persona, setPersona] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    fetchDestilerias();
  }, []);

  async function fetchDestilerias() {
    try {
      const data = await apiFetch("/destilerias/admin/list");
      setDestilerias(data);
    } catch {
      setError("No se pudieron cargar las destilerías");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!editingId && galeriaFiles.length < 3) {
      setError("Debes subir al menos 3 imágenes para la galería");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form };
      let result;

      if (editingId) {
        result = await apiFetch(`/destilerias/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        result = await apiFetch("/destilerias", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      const destileriaId = editingId || result.id_destileria;

      if (logoFile) {
        const fd = new FormData();
        fd.append("imagen", logoFile);
        await apiFetch(`/destilerias/${destileriaId}/imagen`, {
          method: "POST",
          body: fd,
        });
      }

      if (personaFile) {
        const fd = new FormData();
        fd.append("imagen", personaFile);
        fd.append("nombre", persona.nombre);
        fd.append("descripcion", persona.descripcion);

        await apiFetch(`/destilerias/${destileriaId}/persona`, {
          method: "POST",
          body: fd,
        });
      }

      if (galeriaFiles.length) {
        const fd = new FormData();
        galeriaFiles.forEach((f) => fd.append("imagenes", f));

        await apiFetch(`/destilerias/${destileriaId}/galeria`, {
          method: "POST",
          body: fd,
        });
      }

      resetForm();
      await fetchDestilerias();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(d) {
    setEditingId(d.id_destileria);
    setForm({
      nombre_comercial: d.nombre_comercial || "",
      descripcion: d.descripcion || "",
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
    if (!confirm("¿Eliminar destilería?")) return;
    await apiFetch(`/destilerias/${id}`, { method: "DELETE" });
    fetchDestilerias();
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      nombre_comercial: "",
      descripcion: "",
      email_contacto: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      pais: "",
      sitio_web: "",
      activo: 1,
    });
    setPersona({ nombre: "", descripcion: "" });
    setLogoFile(null);
    setPersonaFile(null);
    setGaleriaFiles([]);
  }

  return (
    <div className="admin-wrap">
      <h2>Administrar Destilerías</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSave} className="admin-form">
        <input placeholder="Nombre comercial" name="nombre_comercial" value={form.nombre_comercial} onChange={handleChange} required />
        <textarea placeholder="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />

        <input placeholder="Email contacto" name="email_contacto" value={form.email_contacto} onChange={handleChange} />
        <input placeholder="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
        <input placeholder="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
        <input placeholder="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} />
        <input placeholder="País" name="pais" value={form.pais} onChange={handleChange} />
        <input placeholder="Sitio web" name="sitio_web" value={form.sitio_web} onChange={handleChange} />

        <select name="activo" value={form.activo} onChange={handleChange}>
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>

        <label>Logo</label>
        <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />

        <label>Persona destacada</label>
        <input type="file" onChange={(e) => setPersonaFile(e.target.files[0])} />
        <input placeholder="Nombre persona" value={persona.nombre} onChange={(e) => setPersona((p) => ({ ...p, nombre: e.target.value }))} />
        <textarea placeholder="Descripción persona" value={persona.descripcion} onChange={(e) => setPersona((p) => ({ ...p, descripcion: e.target.value }))} />

        <label>Galería (Carrusel) — mínimo 3 imágenes</label>
        <input type="file" multiple onChange={(e) => setGaleriaFiles([...e.target.files])} />
        <small>{galeriaFiles.length} / 3 imágenes seleccionadas</small>

        <button disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar destilería" : "Crear destilería"}
        </button>
      </form>

      <ul className="admin-list">
        {destilerias.map((d) => (
          <li key={d.id_destileria}>
            <strong>{d.nombre_comercial}</strong>
            <span>{d.ciudad}, {d.pais}</span>
            <div>
              <button onClick={() => handleEdit(d)}>Editar</button>
              <button className="danger" onClick={() => handleDelete(d.id_destileria)}>Eliminar</button>

              <button
                type="button"
                className="dalma-primary-btn dalma-products-btn"
                onClick={() => navigate(`/admin/destilerias/${d.id_destileria}/productos`)}
              >
                Gestionar productos
              </button>

              {/*GESTIONAR CÓCTELES */}
              <button
                type="button"
                className="dalma-primary-btn"
                onClick={() => navigate(`/admin/destilerias/${d.id_destileria}/cocteles`)}
              >
                Gestionar cócteles
              </button>

              <button
                type="button"
                className="dalma-primary-btn"
                onClick={() =>
                  navigate(`/admin/eventos?id_destileria=${d.id_destileria}`)
                }
              >
                Gestionar eventos
              </button>


            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .admin-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding: 20px 16px 100px;
        }

        h2 {
          text-align: center;
          color: #f28c28;
        }

        .error {
          color: red;
          text-align: center;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .admin-form input,
        .admin-form textarea,
        .admin-form select {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .admin-form small {
          font-size: 12px;
          color: #666;
        }

        .admin-form button {
          margin-top: 12px;
          padding: 14px;
          border-radius: 999px;
          border: none;
          background: #f28c28;
          color: #111;
          font-weight: 900;
        }

        .admin-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .admin-list li {
          background: #fff;
          padding: 14px;
          border-radius: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.12);
        }

        .admin-list button {
          margin-right: 8px;
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
        }

        .admin-list .danger {
          background: #e74c3c;
          color: #fff;
        }

        .dalma-primary-btn {
          width: 100%;
          padding: 14px;
          margin-top: 12px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #f28c28, #ff9f43);
          color: #111;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.04em;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(242, 140, 40, 0.45);
        }

        .dalma-products-btn {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
