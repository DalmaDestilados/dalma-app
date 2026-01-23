import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:3001/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  // Axios configurado para JWT
  const api = axios.create({
    baseURL: API,
  });

  // 👉 Agregar token automáticamente
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Obtener usuario autenticado
  async function getMe() {
    try {
      const res = await api.get("/me");
      setUser(res.data.user);
      setIsAuthed(true);
      return res.data.user;
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthed(false);
      return null;
    }
  }

  // Al cargar la app
  useEffect(() => {
    (async () => {
      await getMe();
      setBooting(false);
    })();
  }, []);

  // Login
  async function login(form) {
    const res = await api.post("/login", {
      email: form.email,
      password: form.password,
    });

    // 👉 Guardar JWT
    localStorage.setItem("token", res.data.token);

    setUser(res.data.usuario);
    setIsAuthed(true);

    return res.data.usuario;
  }

  // Registro (según tu backend)
  async function register(form) {
    const payload = {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      edad: form.edad,
      telefono: form.telefono,
      rol: form.rol,
    };

    const res = await api.post("/register", payload);
    return res.data;
  }

  // Logout (frontend)
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthed(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed,
        booting,
        login,
        register,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
