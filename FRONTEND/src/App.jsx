import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AdminDestilerias from "./pages/AdminDestilerias.jsx";
import AdminProductos from "./pages/AdminProductos.jsx"; // 🔹 IMPORT CORRECTO

import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./pages/Cart.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

import ProducersList from "./pages/ProducersList.jsx";
import ProducerDetail from "./pages/ProducerDetail.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CoctailList from "./pages/CoctailList.jsx"; // ✅ NOMBRE REAL DEL ARCHIVO
import CoctailDetail from "./pages/CoctailDetail.jsx";

// NUEVAS PÁGINAS
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");
  const location = useLocation();

  const hideChrome =
    location.pathname === "/" ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="app-container">
      {!hideChrome && (
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
        />
      )}

      <main className="main-content">
        <Routes>
          {/* Landing publica */}
          <Route path="/" element={<Landing />} />

          {/* Auth publicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Flujos por correo */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Home protegido */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home searchTerm={searchTerm} category={category} />
              </ProtectedRoute>
            }
          />

          {/* Admin destilerías protegido */}
          <Route
            path="/admin/destilerias"
            element={
              <ProtectedRoute>
                <AdminDestilerias />
              </ProtectedRoute>
            }
          />

          {/* Admin productos protegido */}
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <AdminProductos />
              </ProtectedRoute>
            }
          />

          {/* Bottom nav protegidas */}
          <Route
            path="/buscar"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Productores públicos */}
          <Route path="/productores" element={<ProducersList />} />
          <Route
            path="/productores/:producerId"
            element={<ProducerDetail />}
          />

          {/* 🔥 RUTA QUE FALTABA (PRODUCTOS POR DESTILERÍA) */}
          <Route
            path="/productores/:producerId/productos"
            element={<ProductList />}
          />

          {/* Productos directos */}
          <Route path="/productos" element={<ProductList />} />
          <Route
            path="/productos/:productId"
            element={<ProductDetail />}
          />

          {/* Cócteles protegidos */}
          <Route
            path="/cocteles"
            element={
              <ProtectedRoute>
                <CoctailList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cocteles/:cocktailId"
            element={
              <ProtectedRoute>
                <CoctailDetail />
              </ProtectedRoute>
            }
          />

          {/* Perfil protegido */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideChrome && <BottomNav />}
    </div>
  );
}
