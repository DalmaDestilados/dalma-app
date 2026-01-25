import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function AdminCocteles() {
  const { idDestileria } = useParams();
  const navigate = useNavigate();

  const [cocteles, setCocteles] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    destilado_principal: "",
  });

  /* =========================
     CARGAR CÓCTELES
  ========================= */
  useEffect(() => {
    fetchCocteles();
  }, [idDestileria]);

  async function fetchCocteles() {
    try {
      const data = await apiFetch(`/cocteles/destileria/${idDestileria}`);
      setCocteles(data);
    } catch {
      setError("Error al cargar cócteles");
    }
  }

  /* =========================
     UTIL IMAGEN 🔥 FIX
  ========================= */
  function getImageUrl(path) {
    if (!path) return null;
    return `${API_BASE}/${path.replace(/^\/+/, "")}`;
  }

  /* =========================
     FORM
  ========================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleIngredienteChange(index, field, value) {
    const copy = [...ingredientes];
    copy[index][field] = value;
    setIngredientes(copy);
  }

  function addIngrediente() {
    setIngredientes([...ingredientes, { ingrediente: "", cantidad: "" }]);
  }

  function resetForm() {
    setForm({
      nombre: "",
      descripcion: "",
      destilado_principal: "",
    });
    setIngredientes([]);
    setEditingId(null);
    setImageFile(null);
  }

  function handleEdit(c) {
    setEditingId(c.id_coctel);
    setForm({
      nombre: c.nombre || "",
      descripcion: c.descripcion || "",
      destilado_principal: c.destilado_principal || "",
    });

    if (typeof c.ingredientes === "string") {
      const parsed = c.ingredientes.split(",").map((i) => {
        const match = i.match(/(.+?)(?:\s\((.+)\))?$/);
        return {
          ingrediente: match?.[1]?.trim() || "",
          cantidad: match?.[2]?.trim() || "",
        };
      });
      setIngredientes(parsed);
    } else {
      setIngredientes(c.ingredientes || []);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar cóctel?")) return;
    await apiFetch(`/cocteles/${id}`, { method: "DELETE" });
    fetchCocteles();
  }

  /* =========================
     GUARDAR CÓCTEL
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        id_destileria: idDestileria,
      };

      let coctelId;

      if (editingId) {
        await apiFetch(`/cocteles/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        coctelId = editingId;
      } else {
        const res = await apiFetch("/cocteles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        coctelId = res.id_coctel;
      }

      if (imageFile) {
        const fd = new FormData();
        fd.append("imagen", imageFile);

        await apiFetch(`/cocteles/${coctelId}/imagen`, {
          method: "POST",
          body: fd,
        });
      }

      const ingredientesValidos = ingredientes.filter(
        (i) => i.ingrediente && i.ingrediente.trim()
      );

      if (ingredientesValidos.length) {
        await apiFetch(`/cocteles/${coctelId}/ingredientes`, {
          method: "POST",
          body: JSON.stringify({ ingredientes: ingredientesValidos }),
        });
      }

      resetForm();
      fetchCocteles();
    } catch (err) {
      console.error(err);
      setError("Error al guardar cóctel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-wrap">
      <button className="back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h2>Cócteles de la destilería</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="destilado_principal" placeholder="Destilado principal" value={form.destilado_principal} onChange={handleChange} />

        <label>Ingredientes</label>
        {ingredientes.map((i, idx) => (
          <div key={idx} style={{ display: "flex", gap: 6 }}>
            <input
              placeholder="Ingrediente"
              value={i.ingrediente}
              onChange={(e) => handleIngredienteChange(idx, "ingrediente", e.target.value)}
            />
            <input
              placeholder="Cantidad"
              value={i.cantidad}
              onChange={(e) => handleIngredienteChange(idx, "cantidad", e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addIngrediente}>
          + Agregar ingrediente
        </button>

        <label>Imagen del cóctel</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

        <button disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar cóctel" : "Crear cóctel"}
        </button>
      </form>

      <div className="list">
        {cocteles.map((c) => (
          <div key={c.id_coctel} className="card">
            {c.imagen_url && (
              <img
                src={getImageUrl(c.imagen_url)}
                alt={c.nombre}
                className="product-img"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}

            <strong>{c.nombre}</strong>
            <span>{c.destilado_principal}</span>

            <div className="actions">
              <button onClick={() => handleEdit(c)}>Editar</button>
              <button className="danger" onClick={() => handleDelete(c.id_coctel)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

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
