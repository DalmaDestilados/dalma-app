import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/* =========================
   BASES DE API
========================= */
const API_AUTH = "http://localhost:3001/api/auth";
const API_PASSWORD = "http://localhost:3001/api/password";

/* =========================
   LOCKS
========================= */
let isLogging = false;
let isGettingMe = false;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const api = axios.create({
    baseURL: API_AUTH,
  });

  // INTERCEPTOR
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  /* =========================
     GET ME
  ========================= */
  async function getMe() {
    if (isGettingMe) return user;

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAuthed(false);
      return null;
    }

    try {
      isGettingMe = true;

      const res = await api.get("/me");
      const usuario = res.data || null;

      if (usuario) {
        setUser(usuario);
        setIsAuthed(true);
      }

      return usuario;
    } catch {
      setUser(null);
      setIsAuthed(false);
      return null;
    } finally {
      isGettingMe = false;
    }
  }

  useEffect(() => {
    (async () => {
      await getMe();
      setBooting(false);
    })();
  }, []);

  /* =========================
     LOGIN
  ========================= */
  async function login(form) {
    if (isLogging) return;
    isLogging = true;

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        setUser(user);
        setIsAuthed(true);
      }

      return user;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Credenciales incorrectas"
      );
    } finally {
      isLogging = false;
    }
  }

  /* =========================
     REGISTER
  ========================= */
  async function register(form) {
    try {
      const res = await api.post("/register", {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        fecha_nacimiento: form.fecha_nacimiento,
        telefono: form.telefono,
        tipoCuenta: form.tipoCuenta,
      });

      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Error al registrar usuario"
      );
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  function logout() {
    setUser(null);
    setIsAuthed(false);
    localStorage.removeItem("token");
  }

  /* =========================
     VERIFY EMAIL
  ========================= */
  async function verifyEmail({ token }) {
    try {
      const res = await api.post("/verify-email", { token });
      return res.data?.message;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "No se pudo verificar el correo"
      );
    }
  }

  /* =========================
     FORGOT PASSWORD
  ========================= */
  async function forgotPassword(email) {
    try {
      const res = await axios.post(
        `${API_PASSWORD}/forgot`,
        { email },
        { withCredentials: true }
      );
      return res.data?.message;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "No se pudo enviar el correo"
      );
    }
  }

  /* =========================
     RESET PASSWORD
  ========================= */
  async function resetPassword(data) {
    if (isResetting) return;
    setIsResetting(true);

    try {
      const res = await axios.post(
        `${API_PASSWORD}/reset`,
        data,
        { withCredentials: true }
      );
      return res.data?.message;
    } catch (err) {
      if (err.response?.status === 429) {
        throw new Error("Demasiados intentos. Espera un momento.");
      }
      throw new Error(
        err.response?.data?.message || "No se pudo cambiar la contraseña"
      );
    } finally {
      setIsResetting(false);
    }
  }

  /* =========================
     CONTEXT
  ========================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ✅ agregado para Profile.jsx
        usuarios: user,
        isAuthed,
        booting,
        login,
        register,
        logout,
        getMe,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
