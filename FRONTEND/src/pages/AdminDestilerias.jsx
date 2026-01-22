import { useEffect, useState } from "react";

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
  const [editingId, setEditingId] = useState(null); // <-- para editar

  const API_URL = "http://localhost:3001/api/destilerias";

  useEffect(() => {
    fetchDestilerias();
  }, []);

  async function fetchDestilerias() {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();
      setDestilerias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las destilerías");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res, data;
      if (editingId) {
        // EDITAR
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar destilería");
        data = await res.json();
        setDestilerias(destilerias.map(d => (d.id_destileria === editingId ? data : d)));
      } else {
        // CREAR
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al guardar destilería");
        data = await res.json();
        setDestilerias([data, ...destilerias]);
      }

      // RESET FORM
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
      setEditingId(null);
    } catch (err) {
      console.error("Error al guardar destilería:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(d) {
    setEditingId(d.id_destileria);
    setForm({
      nombre_comercial: d.nombre_comercial,
      descripcion: d.descripcion,
      logo_url: d.logo_url,
      email_contacto: d.email_contacto,
      telefono: d.telefono,
      direccion: d.direccion,
      ciudad: d.ciudad,
      pais: d.pais,
      sitio_web: d.sitio_web,
      activo: d.activo,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta destilería?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setDestilerias(destilerias.filter(d => d.id_destileria !== id));
    } catch (err) {
      console.error("Error al eliminar destilería:", err);
      setError("No se pudo eliminar la destilería");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Destilerías</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSave} style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" name="nombre_comercial" placeholder="Nombre comercial" value={form.nombre_comercial} onChange={handleChange} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input type="text" name="logo_url" placeholder="URL Logo" value={form.logo_url} onChange={handleChange} />
        <input type="email" name="email_contacto" placeholder="Email contacto" value={form.email_contacto} onChange={handleChange} />
        <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input type="text" name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
        <input type="text" name="pais" placeholder="País" value={form.pais} onChange={handleChange} />
        <input type="text" name="sitio_web" placeholder="Sitio web" value={form.sitio_web} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Guardando..." : editingId ? "Actualizar destilería" : "Guardar destilería"}</button>
      </form>

      <h3>Lista de Destilerías</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {destilerias.map(d => (
          <li key={d.id_destileria} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
            <span>{d.nombre_comercial} - {d.ciudad}, {d.pais}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => handleEdit(d)} style={{ background: "#f0ad4e", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}>Editar</button>
              <button onClick={() => handleDelete(d.id_destileria)} style={{ background: "red", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
