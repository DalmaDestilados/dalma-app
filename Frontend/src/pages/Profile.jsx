import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiFetch } from "../api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function Profile() {
  const { user, logout, setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     CARGAR PERFIL
  ========================= */
  useEffect(() => {
    if (!user) return;

    async function fetchPerfil() {
      try {
        const data = await apiFetch("/usuarios/perfil");

        setName(data.nombre || "");
        setEmail(data.email || "");

        if (data.foto_perfil) {
          setPreview(`${API_BASE}/${data.foto_perfil}`);
        }

        setUser((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchPerfil();
  }, [user?.id_usuario]);

  /* =========================
     VALIDAR EMAIL
  ========================= */
  function validateEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  }

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
    setSuccess("");

    try {
      if (name.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
      }

      if (!validateEmail(email)) {
        throw new Error("Correo electrónico inválido");
      }

      /* 1️⃣ Actualizar nombre */
      await apiFetch("/usuarios/perfil", {
        method: "PUT",
        body: JSON.stringify({ nombre: name }),
      });

      /* 2️⃣ Cambiar correo si es distinto */
      if (email !== user.email) {
        if (!passwordConfirm) {
          throw new Error("Debes confirmar tu contraseña");
        }

        await apiFetch("/usuarios/perfil/email", {
          method: "PUT",
          body: JSON.stringify({
            email,
            password: passwordConfirm,
          }),
        });
      }

      let fotoPerfil = user.foto_perfil;

      /* 3️⃣ Subir imagen */
      if (photo) {
        const fd = new FormData();
        fd.append("imagen", photo);

        const imgRes = await apiFetch("/usuarios/perfil/foto", {
          method: "POST",
          body: fd,
        });

        fotoPerfil = imgRes.foto_perfil;
      }

      /* 4️⃣ Actualizar contexto */
      setUser({
        ...user,
        nombre: name,
        email,
        foto_perfil: fotoPerfil,
      });

      setSuccess("Perfil actualizado correctamente");
      setEditing(false);
      setPasswordConfirm("");
    } catch (err) {
      setError(err.message || "Error al actualizar perfil");
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
          <h2>{user.nombre || "Usuario"}</h2>
          <p className="profile-subtitle">{user.email}</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">

            <label>
              Nombre público
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {email !== user.email && (
              <label>
                Confirmar contraseña
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </label>
            )}

            <label className="file-label">
              Cambiar foto
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
                <span>Correo</span>
                <strong>{user.email}</strong>
              </div>

              <div className="info-row">
                <span>Nombre</span>
                <strong>{user.nombre || "No definido"}</strong>
              </div>

              <div className="info-row">
                <span>Rol</span>
                <span className="badge">
                  {user.id_rol === 3 ? "Administrador" : "Usuario"}
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
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f28c28, #ffb066);
          padding: 20px;
        }

        .profile-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 25px 50px rgba(0,0,0,.2);
          animation: fadeIn .4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin: 0 auto 15px;
          background: linear-gradient(135deg, #f28c28, #ffb066);
          color: #fff;
          font-size: 40px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,.2);
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-subtitle {
          font-size: 13px;
          color: #666;
        }

        .profile-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .badge {
          background: #fde9d8;
          color: #f28c28;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: bold;
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
          border-radius: 10px;
          border: 1px solid #ddd;
          transition: .2s;
        }

        .profile-form input:focus {
          outline: none;
          border-color: #f28c28;
          box-shadow: 0 0 0 2px rgba(242,140,40,.2);
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
          font-weight: bold;
          cursor: pointer;
          transition: .2s;
        }

        .btn-primary {
          background: #f28c28;
          color: #fff;
        }

        .btn-primary:hover {
          background: #e77a1d;
        }

        .btn-outline {
          background: #eee;
        }

        .btn-danger {
          background: #e74c3c;
          color: #fff;
        }

        .alert {
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .alert.error {
          background: #ffe5e5;
          color: #d63031;
        }

        .alert.success {
          background: #e6ffed;
          color: #27ae60;
        }
      `}</style>
    </div>
  );
}
