import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function Profile() {
  const { user, logout, setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  /* =========================
     CARGAR PERFIL DESDE DB
  ========================= */
  useEffect(() => {
    if (!user) return;

    async function fetchPerfil() {
      try {
        const data = await apiFetch("/usuarios/perfil");

        setName(data.nombre || "");

        if (data.foto_perfil) {
          setPreview(`${API_BASE}/${data.foto_perfil}`);
        }

        // sincroniza AuthContext
        setUser((prev) => ({
          ...prev,
          nombre: data.nombre,
          foto_perfil: data.foto_perfil,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchPerfil();
  }, [user, setUser]);

  /* =========================
     FOTO PREVIEW
  ========================= */
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  /* =========================
     GUARDAR PERFIL
  ========================= */
  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /* 1️⃣ Actualizar nombre */
      await apiFetch("/usuarios/perfil", {
        method: "PUT",
        body: JSON.stringify({ nombre: name }),
      });

      let fotoPerfil = user.foto_perfil;

      /* 2️⃣ Subir imagen (si hay) */
      if (photo) {
        const fd = new FormData();
        fd.append("imagen", photo);

        const imgRes = await apiFetch("/usuarios/perfil/foto", {
          method: "POST",
          body: fd,
        });

        fotoPerfil = imgRes.foto_perfil;
      }

      /* 3️⃣ Actualizar contexto */
      setUser({
        ...user,
        nombre: name,
        foto_perfil: fotoPerfil,
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <p style={{ padding: 20 }}>No hay usuario logueado.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {preview ? (
              <img src={preview} alt="avatar" />
            ) : (
              user.email.charAt(0).toUpperCase()
            )}
          </div>

          <h2>Perfil de usuario</h2>
          <p className="profile-subtitle">Cuenta Dalma</p>
        </div>

        {error && <p className="error">{error}</p>}

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            <label>
              Nombre público
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="file-label">
              Foto de perfil
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <div className="profile-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Correo</span>
                <span className="value">{user.email}</span>
              </div>

              <div className="info-row">
                <span className="label">Nombre</span>
                <span className="value">
                  {user.nombre || "No definido"}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Rol</span>
                <span className="badge">
                  {user.role === 3 ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="btn-outline"
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
              <button className="btn-danger" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .profile-page {
          min-height: calc(100vh - 80px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f7f7f7;
          padding: 40px 20px;
        }

        .profile-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,.12);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          margin: 0 auto 10px;
          background: linear-gradient(135deg, #f28c28, #ffb066);
          color: #fff;
          font-size: 38px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-subtitle {
          font-size: 13px;
          color: #777;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 10px;
        }

        .label {
          font-size: 13px;
          color: #666;
        }

        .value {
          font-weight: 700;
        }

        .badge {
          background: #fde9d8;
          color: #f28c28;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .profile-form label {
          display: flex;
          flex-direction: column;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .profile-form input {
          margin-top: 6px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .profile-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .profile-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 999px;
          border: none;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-primary {
          background: #f28c28;
          color: #fff;
        }

        .btn-outline {
          background: #eee;
        }

        .btn-danger {
          background: #e74c3c;
          color: #fff;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
