import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:3001/api/auth";

let isLogging = false;
let isGettingMe = false;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const api = axios.create({
    baseURL: API,
    withCredentials: true,
  });

  async function getMe() {
    if (isGettingMe) return user;

    try {
      isGettingMe = true;

      const res = await api.get("/me");
      const usuario = res.data?.user || null;

      if (usuario) {
        setUser(usuario);
        setIsAuthed(true);
      }

      return usuario;
    } catch {
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

  async function login(form) {
    if (isLogging) return;
    isLogging = true;

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

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

  // 🔥 AQUÍ ESTABA EL ERROR REAL
  async function register(form) {
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        fecha_nacimiento: form.fecha_nacimiento,
        acepta_terminos: true, // 🔒 backend exige confirmación
      };

      const res = await api.post("/register", payload);
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
      return (
        res.data?.message ||
        "Correo verificado correctamente. Ya puedes iniciar sesión."
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "No se pudo verificar el correo."
      );
    }
  }

  async function forgotPassword(email) {
    try {
      const res = await api.post("/forgot-password", { email });
      return res.data?.message;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "No se pudo enviar el correo"
      );
    }
  }

  async function resetPassword(data) {
    if (isResetting) return;
    setIsResetting(true);

    try {
      const res = await api.post("/reset-password", data);
      return res.data?.message;
    } catch (err) {
      if (err.response?.status === 429) {
        throw new Error(
          "Has enviado muchas solicitudes. Espera unos segundos antes de intentar nuevamente."
        );
      }
      throw new Error(
        err.response?.data?.message || "No se pudo cambiar contraseña"
      );
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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
