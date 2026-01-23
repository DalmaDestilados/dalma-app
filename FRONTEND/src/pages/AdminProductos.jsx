import { useEffect, useState } from "react";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    grado_alcoholico: "",
    contenido_neto: "",
    id_destileria: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:3001/api/productos";

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos");
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
        if (!res.ok) throw new Error("Error al actualizar producto");
        data = await res.json();
        setProductos(productos.map(p => (p.id_producto === editingId ? data : p)));
      } else {
        // CREAR
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear producto");
        data = await res.json();
        setProductos([data, ...productos]);
      }

      setForm({
        nombre: "",
        descripcion: "",
        categoria: "",
        precio: "",
        stock: "",
        grado_alcoholico: "",
        contenido_neto: "",
        id_destileria: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(p) {
    setEditingId(p.id_producto);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      grado_alcoholico: p.grado_alcoholico,
      contenido_neto: p.contenido_neto,
      id_destileria: p.id_destileria,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setProductos(productos.filter(p => p.id_producto !== id));
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Productos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSave} style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input type="text" name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input type="number" name="grado_alcoholico" placeholder="Grado alcohólico (%)" value={form.grado_alcoholico} onChange={handleChange} />
        <input type="number" name="contenido_neto" placeholder="Contenido neto (ml)" value={form.contenido_neto} onChange={handleChange} />
        <input type="number" name="id_destileria" placeholder="ID Destilería" value={form.id_destileria} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Guardando..." : editingId ? "Actualizar producto" : "Guardar producto"}</button>
      </form>

      <h3>Lista de Productos</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {productos.map(p => (
          <li key={p.id_producto} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
            <span>{p.nombre} - {p.categoria} - ${Number(p.precio).toLocaleString()}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => handleEdit(p)} style={{ background: "#f0ad4e", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}>Editar</button>
              <button onClick={() => handleDelete(p.id_producto)} style={{ background: "red", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
