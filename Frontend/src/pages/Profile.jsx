import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* NUEVO */
  const [view, setView] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [deseos, setDeseos] = useState([]);

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
     FAVORITOS / DESEOS
  ========================= */

  async function loadFavoritos() {
    try {
      const data = await apiFetch("/favoritos");
      setFavoritos(data);
      setView("favoritos");
    } catch {
      setFavoritos([]);
    }
  }

  async function loadDeseos() {
    try {
      const data = await apiFetch("/deseos");
      setDeseos(data);
      setView("deseos");
    } catch {
      setDeseos([]);
    }
  }

  /* =========================
     VALIDAR EMAIL
  ========================= */
  function validateEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

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

      await apiFetch("/usuarios/perfil", {
        method: "PUT",
        body: JSON.stringify({ nombre: name }),
      });

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

      if (photo) {
        const fd = new FormData();
        fd.append("imagen", photo);

        const imgRes = await apiFetch("/usuarios/perfil/foto", {
          method: "POST",
          body: fd,
        });

        fotoPerfil = imgRes.foto_perfil;
      }

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

        {/* HEADER */}
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

        {/* INFO NORMAL */}
        {!editing && (
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
              <button className="btn-outline" onClick={() => setEditing(true)}>
                Editar perfil
              </button>
              <button className="btn-danger" onClick={logout}>
                Cerrar sesión
              </button>
            </div>

            <div className="profile-links">
              <button onClick={loadFavoritos}>
                ❤️ Mis Favoritos
              </button>
              <button onClick={loadDeseos}>
                ⭐ Lista de Deseos
              </button>
            </div>
          </>
        )}

        {/* PANEL LISTA */}
        {view && (
          <div className="list-panel">
            <div className="panel-header">
              <h3>
                {view === "favoritos"
                  ? "❤️ Mis Favoritos"
                  : "⭐ Lista de Deseos"}
              </h3>
              <button onClick={() => setView(null)}>✕</button>
            </div>

            <div className="panel-grid">
              {(view === "favoritos" ? favoritos : deseos).length === 0 && (
                <p>No hay productos guardados.</p>
              )}

              {(view === "favoritos" ? favoritos : deseos).map((p) => (
                <div
                  key={p.id_producto}
                  className="panel-card"
                  onClick={() =>
                    navigate(`/productos/${p.id_producto}`)
                  }
                >
                  <img
                    src={`${API_BASE}/${p.imagen_url}`}
                    alt={p.nombre}
                  />
                  <h4>{p.nombre}</h4>
                  <span>
                    ${Number(p.precio).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

<style>{`
.profile-page {
  min-height: 100vh;
  padding: 20px 20px 120px 20px; /* CORRIGE LINEA BLANCA */
  background: linear-gradient(135deg, #f28c28, #ffb066);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 25px 50px rgba(0,0,0,.2);
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
}

.btn-outline { background: #eee; }
.btn-danger { background: #e74c3c; color: #fff; }

.profile-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.profile-links button {
  padding: 10px;
  border-radius: 14px;
  border: none;
  background: #fde9d8;
  cursor: pointer;
  font-weight: 600;
}

.list-panel {
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-grid {
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.panel-card {
  background: #fff7ef;
  padding: 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: .2s;
  text-align: center;
}

.panel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,.1);
}

.panel-card img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
}

.panel-card h4 {
  font-size: 13px;
  margin: 8px 0 4px;
}

.panel-card span {
  font-weight: bold;
  font-size: 13px;
}

`}</style>

    </div>
  );
}
