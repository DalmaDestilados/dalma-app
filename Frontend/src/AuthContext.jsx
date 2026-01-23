import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:3001/api/auth";

let isLogging = false;
let isGettingMe = false;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // <-- sigue como user
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const [isResetting, setIsResetting] = useState(false); // <-- agregado para resetPassword

  const api = axios.create({
    baseURL: API,
    withCredentials: true, // 🔥 necesario para cookies
  });

  async function getMe() {
    // Evita múltiples requests al mismo tiempo
    if (isGettingMe) return user;

    try {
      isGettingMe = true;

      const res = await api.get("/me");

      // 🔥 CORRECCIÓN REAL: el backend devuelve { user: {...} }
      const usuario = res.data?.user || null;

      if (usuario) {
        setUser(usuario);
        setIsAuthed(true);
      }

      return usuario;
    } catch {
      // ❗ NO hacer logout acá (productos son públicos)
      return null;
    } finally {
      isGettingMe = false;
    }
  }

  useEffect(() => {
    // Solo se ejecuta una vez al montar el AuthProvider
    (async () => {
      await getMe();
      setBooting(false);
    })();
  }, []);

  async function login(form) {
    if (isLogging) return;
    isLogging = true;

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      // 🔥 CORRECCIÓN REAL
      const usuario = res.data?.user || null;

      if (usuario) {
        setUser(usuario);
        setIsAuthed(true);
      }

      return usuario;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Credenciales incorrectas");
    } finally {
      isLogging = false;
    }
  }

  async function register(form) {
    try {
      const res = await api.post("/register", form);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Error al registrar");
    }
  }

  async function logout() {
    await api.post("/logout");
    setUser(null);
    setIsAuthed(false);
  }

  async function verifyEmail({ email, token }) {
    try {
      const res = await api.post("/verify-email", { email, token });
      return res.data?.message || "Correo verificado correctamente. Ya puedes iniciar sesión.";
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo verificar el correo.");
    }
  }

  async function forgotPassword(email) {
    try {
      const res = await api.post("/forgot-password", { email });
      return res.data?.message;
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo enviar el correo");
    }
  }

  async function resetPassword(data) {
    // Evita envíos múltiples al mismo tiempo desde el frontend
    if (isResetting) return;
    setIsResetting(true);

    try {
      const res = await api.post("/reset-password", data);
      return res.data?.message;
    } catch (err) {
      // Manejo de 429 solo para mostrar mensaje al usuario
      if (err.response?.status === 429) {
        throw new Error(
          "Has enviado muchas solicitudes. Espera unos segundos antes de intentar nuevamente."
        );
      }
      throw new Error(err.response?.data?.message || "No se pudo cambiar contraseña");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user, // <-- se mantiene
        usuarios: user, // <-- se mantiene para el botón admin
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
