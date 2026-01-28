import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function AdminProductos() {
  const { idDestileria } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    grado_alcoholico: "",
    contenido_neto: "",
    cata_aromas: "",
    cata_dulzor: "",
    cata_cuerpo: "",
    cata_persistencia: "",
  });

  /* =========================
     CARGAR PRODUCTOS
  ========================= */
  useEffect(() => {
    fetchProductos();
  }, [idDestileria]);

  async function fetchProductos() {
    try {
      const data = await apiFetch(`/productos/destileria/${idDestileria}`);
      setProductos(data);
    } catch {
      setError("Error al cargar productos");
    }
  }

  /* =========================
     FORM
  ========================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({
      nombre: "",
      descripcion: "",
      categoria: "",
      precio: "",
      stock: "",
      grado_alcoholico: "",
      contenido_neto: "",
      cata_aromas: "",
      cata_dulzor: "",
      cata_cuerpo: "",
      cata_persistencia: "",
    });
    setEditingId(null);
    setImageFile(null);
    setError("");
  }

  function handleEdit(p) {
    setEditingId(p.id_producto);
    setForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      categoria: p.categoria || "",
      precio: p.precio || "",
      stock: p.stock || "",
      grado_alcoholico: p.grado_alcoholico || "",
      contenido_neto: p.contenido_neto || "",
      cata_aromas: p.cata_aromas ?? "",
      cata_dulzor: p.cata_dulzor ?? "",
      cata_cuerpo: p.cata_cuerpo ?? "",
      cata_persistencia: p.cata_persistencia ?? "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar producto?")) return;
    await apiFetch(`/productos/${id}`, { method: "DELETE" });
    fetchProductos();
  }

  /* =========================
     ✅ VALIDACIONES SEGURAS
  ========================= */
  function validarFormulario() {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.categoria.trim()) return "La categoría es obligatoria";

    if (Number(form.precio) <= 0) return "El precio debe ser mayor a 0";
    if (Number(form.stock) < 0) return "El stock no puede ser negativo";
    if (Number(form.grado_alcoholico) < 0 || Number(form.grado_alcoholico) > 100)
      return "El grado alcohólico debe estar entre 0 y 100";
    if (Number(form.contenido_neto) <= 0)
      return "El contenido neto debe ser mayor a 0";

    const catas = [
      form.cata_aromas,
      form.cata_dulzor,
      form.cata_cuerpo,
      form.cata_persistencia,
    ];

    for (const v of catas) {
      if (v !== "" && (v < 1 || v > 5)) {
        return "Los valores de la rueda de cata deben ser entre 1 y 5";
      }
    }

    if (imageFile) {
      if (!imageFile.type.startsWith("image/"))
        return "El archivo debe ser una imagen";
      if (imageFile.size > 3 * 1024 * 1024)
        return "La imagen no puede superar los 3MB";
    }

    return null;
  }

  /* =========================
     GUARDAR PRODUCTO
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        id_destileria: idDestileria,
      };

      let productoId;

      if (editingId) {
        await apiFetch(`/productos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        productoId = editingId;
      } else {
        const res = await apiFetch("/productos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        productoId = res.id_producto;
      }

      if (imageFile) {
        const fd = new FormData();
        fd.append("imagen", imageFile);

        await apiFetch(`/productos/${productoId}/imagen`, {
          method: "POST",
          body: fd,
        });
      }

      resetForm();
      fetchProductos();
    } catch {
      setError("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-wrap">
      <button className="back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h2>Productos de la destilería</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input type="number" name="grado_alcoholico" placeholder="% Alcohol" value={form.grado_alcoholico} onChange={handleChange} />
        <input type="number" name="contenido_neto" placeholder="Contenido (ml)" value={form.contenido_neto} onChange={handleChange} />

        <h4>Rueda de cata (1 a 5)</h4>
        <input type="number" min="1" max="5" name="cata_aromas" placeholder="Aromas" value={form.cata_aromas} onChange={handleChange} />
        <input type="number" min="1" max="5" name="cata_dulzor" placeholder="Dulzor" value={form.cata_dulzor} onChange={handleChange} />
        <input type="number" min="1" max="5" name="cata_cuerpo" placeholder="Cuerpo" value={form.cata_cuerpo} onChange={handleChange} />
        <input type="number" min="1" max="5" name="cata_persistencia" placeholder="Persistencia" value={form.cata_persistencia} onChange={handleChange} />

        <label>Imagen del producto</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />

        <button disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar producto" : "Crear producto"}
        </button>
      </form>

      <div className="list">
        {productos.map(p => (
          <div key={p.id_producto} className="card">
            {p.imagen_url && (
              <img
                src={`${API_BASE}/${p.imagen_url}`}
                alt={p.nombre}
                className="product-img"
              />
            )}

            <strong>{p.nombre}</strong>
            <span>${Number(p.precio).toLocaleString("es-CL")}</span>

            <div className="actions">
              <button onClick={() => handleEdit(p)}>Editar</button>
              <button className="danger" onClick={() => handleDelete(p.id_producto)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .admin-wrap {
          max-width: 420px;
          margin: auto;
          padding: 20px 16px 90px;
        }

        .back {
          background: none;
          border: none;
          margin-bottom: 10px;
          font-size: 14px;
        }

        h2 {
          text-align: center;
          color: #f28c28;
        }

        .form input,
        .form textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 14px;
          border: 1px solid #ddd;
        }

        .form button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f28c28, #ff9f43);
          color: #111;
          border: none;
          border-radius: 999px;
          font-weight: 900;
          margin-top: 10px;
        }

        .list {
          margin-top: 20px;
        }

        .card {
          background: #fff;
          padding: 14px;
          border-radius: 18px;
          margin-bottom: 14px;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
        }

        .product-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 14px;
          margin-bottom: 8px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .actions button {
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .danger {
          background: #e74c3c;
          color: white;
        }

        .error {
          color: red;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
