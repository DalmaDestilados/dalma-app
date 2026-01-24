import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProductos();
  }, []);

  // =========================
  // ✅ LISTADO ADMIN CORRECTO
  // =========================
  async function fetchProductos() {
    try {
      const res = await fetch(`${API_BASE}/api/productos/admin/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos (admin)");
      setProductos([]);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        editingId
          ? `${API_BASE}/api/productos/${editingId}`
          : `${API_BASE}/api/productos`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Error al guardar producto");

      await fetchProductos();

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

  // =========================
  // 🔁 OCULTAR / MOSTRAR
  // =========================
  async function handleToggleActivo(p) {
    try {
      const url = p.activo
        ? `${API_BASE}/api/productos/${p.id_producto}`
        : `${API_BASE}/api/productos/${p.id_producto}/mostrar`;

      const method = p.activo ? "DELETE" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cambiar estado");

      await fetchProductos();
    } catch (err) {
      console.error(err);
      setError("No se pudo cambiar el estado del producto");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="admin-wrap">
      <h2>Administrar Productos</h2>
      {error && <p className="admin-error">{error}</p>}

      {/* FORM */}
      <form className="admin-form" onSubmit={handleSave}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key.includes("precio") || key.includes("stock") ? "number" : "text"}
            name={key}
            placeholder={key.replace("_", " ")}
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar producto" : "Crear producto"}
        </button>
      </form>

      {/* LISTA */}
      <div className="admin-grid">
        {productos.map(p => (
          <div
            key={p.id_producto}
            className="admin-card"
            style={{ opacity: p.activo ? 1 : 0.45 }}
          >
            <strong>{p.nombre}</strong>
            <span>{p.categoria}</span>
            <span>${Number(p.precio).toLocaleString()}</span>
            <small>{p.activo ? "Activo" : "Oculto"}</small>

            <div className="admin-actions">
              {/* ✅ FIX: type="button" */}
              <button type="button" onClick={() => handleEdit(p)}>
                Editar
              </button>

              {/* ✅ FIX: type="button" */}
              <button
                type="button"
                className={p.activo ? "danger" : ""}
                onClick={() => handleToggleActivo(p)}
              >
                {p.activo ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS */}
      <style>{`
        .admin-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
        }

        .admin-error {
          color: red;
          margin-bottom: 12px;
        }

        .admin-form {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 30px;
        }

        .admin-form input {
          padding: 10px;
          border-radius: 8px;
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

        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .admin-card {
          border: 1px solid #ddd;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .admin-actions button {
          flex: 1;
          border: none;
          padding: 6px;
          border-radius: 6px;
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
