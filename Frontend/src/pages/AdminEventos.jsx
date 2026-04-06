import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE 

export default function AdminEventos() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const idDestileria = params.get("id_destileria");

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    ubicacion: "",
    fecha: "",
  });

  /* =========================
     CARGAR EVENTOS (ADMIN)
  ========================= */
  useEffect(() => {
    fetchEventos();
  }, [idDestileria]);

  async function fetchEventos() {
    try {
      setError("");

      const data = idDestileria
        ? await apiFetch(`/eventos/destileria/${idDestileria}`) // admin
        : await apiFetch(`/eventos`); // admin (eventos globales)

      setEventos(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar eventos");
    }
  }

  /* =========================
     FORM
  ========================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({
      titulo: "",
      descripcion: "",
      categoria: "",
      ubicacion: "",
      fecha: "",
    });
    setEditingId(null);
    setImageFile(null);
  }

  function handleEdit(e) {
    setEditingId(e.id_evento);
    setForm({
      titulo: e.titulo || "",
      descripcion: e.descripcion || "",
      categoria: e.categoria || "",
      ubicacion: e.ubicacion || "",
      fecha: e.fecha?.slice(0, 10) || "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar evento?")) return;
    await apiFetch(`/eventos/${id}`, { method: "DELETE" });
    fetchEventos();
  }

  /* =========================
     GUARDAR EVENTO
     - GLOBAL si no hay id_destileria
     - DESTILERÍA si existe
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let eventoId;
      let res;

      if (editingId) {
        await apiFetch(`/eventos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        eventoId = editingId;
      } else {
        if (idDestileria) {
          // EVENTO DE DESTILERÍA (ADMIN)
          res = await apiFetch(
            `/eventos/destileria/${idDestileria}`,
            {
              method: "POST",
              body: JSON.stringify(form),
            }
          );
        } else {
          // EVENTO GLOBAL (ADMIN)
          res = await apiFetch(`/eventos`, {
            method: "POST",
            body: JSON.stringify(form),
          });
        }
        eventoId = res.id_evento;
      }

      // subir imagen
      if (imageFile && eventoId) {
        const fd = new FormData();
        fd.append("imagen", imageFile);

        await apiFetch(`/eventos/${eventoId}/imagen`, {
          method: "POST",
          body: fd,
        });
      }

      resetForm();
      fetchEventos();
    } catch (err) {
      console.error(err);
      setError("Error al guardar evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-wrap">
      <button className="back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h2>
        Gestión de Eventos
        {idDestileria ? " · Destilería" : " · Globales"}
      </h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <input
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={handleChange}
        />

        <input
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />

        <label>Imagen del evento</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button disabled={loading}>
          {loading
            ? "Guardando..."
            : editingId
            ? "Actualizar evento"
            : "Crear evento"}
        </button>
      </form>

      <div className="list">
        {eventos.map((e) => (
          <div key={e.id_evento} className="card">
            {e.imagen_url && (
              <img
                src={`${API_BASE}/${e.imagen_url}`}
                alt={e.titulo}
                className="product-img"
              />
            )}

            <strong>{e.titulo}</strong>
            <span>{e.ubicacion}</span>
            <small>
              {new Date(e.fecha).toLocaleDateString("es-CL")}
            </small>

            <div className="actions">
              <button onClick={() => handleEdit(e)}>Editar</button>
              <button
                className="danger"
                onClick={() => handleDelete(e.id_evento)}
              >
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
          cursor: pointer;
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
          border-radius: 999px;
          border: none;
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

        .danger {
          background: #e74c3c;
          color: #fff;
          border-radius: 8px;
          padding: 6px 12px;
          border: none;
        }

        .error {
          color: red;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
