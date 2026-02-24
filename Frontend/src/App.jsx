import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

/* ===== ADMIN ===== */
import AdminDestilerias from "./pages/AdminDestilerias.jsx";
import AdminProductos from "./pages/AdminProductos.jsx";
import AdminCocteles from "./pages/AdminCocteles.jsx";
import AdminEventos from "./pages/AdminEventos.jsx";

/* ===== EVENTOS ===== */
import EventsList from "./pages/EventsList.jsx";
import ProducerEvents from "./pages/ProducerEvents.jsx";

/* ===== LAYOUT ===== */
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* ===== AUTH ===== */
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";

/* ===== HOME / SEARCH ===== */
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./pages/Cart.jsx";

/* ===== DESTILERÍAS / PRODUCTOS ===== */
import ProducersList from "./pages/ProducersList.jsx";
import ProducerDetail from "./pages/ProducerDetail.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

/* ===== CÓCTELES ===== */
import CoctailList from "./pages/CoctailList.jsx";
import CoctailDetail from "./pages/CoctailDetail.jsx";

/* ===== BARTENDERS ===== */
import BartendersList from "./pages/BartendersList.jsx";
import BartenderDetail from "./pages/BartenderDetail.jsx";
import BartenderMe from "./pages/BartenderMe.jsx";
import AdminBartenders from "./pages/BartenderProfileForm..jsx";
import AdminBartendersList from "./pages/AdminBartendersList.jsx";


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
          {/* LANDING */}
          <Route path="/" element={<Landing />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* HOME */}
         <Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
      />
    </ProtectedRoute>
  }
/>

          {/* SEARCH / CART */}
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

          {/* PERFIL USUARIO */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* DESTILERÍAS */}
          <Route path="/productores" element={<ProducersList searchTerm={searchTerm} />} />
          <Route path="/productores/:producerId" element={<ProducerDetail />} />
          <Route
            path="/productores/:producerId/productos"
            element={<ProductList searchTerm={searchTerm} />}
          />
          <Route
            path="/productores/:producerId/eventos"
            element={
              <ProtectedRoute>
                <ProducerEvents />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTOS */}
          <Route path="/productos" element={<ProductList searchTerm={searchTerm} />} />
          <Route path="/productos/:productId" element={<ProductDetail />} />

          {/* ALIAS */}
          <Route path="/skus" element={<ProductList searchTerm={searchTerm} />} />
          <Route path="/skus/:id" element={<ProductDetail />} />

          {/* CÓCTELES */}
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

          {/* BARTENDERS */}
          <Route
            path="/bartenders"
            element={
              <ProtectedRoute>
                <BartendersList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bartenders/me"
            element={
              <ProtectedRoute>
                <BartenderMe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bartenders/:bartenderId"
            element={<BartenderDetail />}
          />



          {/* ADMIN */}
          <Route
            path="/admin/bartenders"
            element={
              <ProtectedRoute>
                <AdminBartendersList />
              </ProtectedRoute>
            }
          />

          {/* BARTENDER */}
          <Route
            path="/bartenders/me/edit"
            element={
              <ProtectedRoute>
                <AdminBartenders /> {/* este es el CRUD del bartender */}
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-cocteles"
            element={
              <ProtectedRoute>
                <AdminCocteles />
              </ProtectedRoute>
            }
          />

          


          {/* ADMIN */}
          <Route
            path="/admin/destilerias"
            element={
              <ProtectedRoute>
                <AdminDestilerias />
              </ProtectedRoute>
            }
          />

          <Route
  path="/admin/destilerias/:idDestileria/productos"
  element={
    <ProtectedRoute>
      <AdminProductos />
    </ProtectedRoute>
  }
/>

          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <AdminProductos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/destilerias/:idDestileria/cocteles"
            element={
              <ProtectedRoute>
                <AdminCocteles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/eventos"
            element={
              <ProtectedRoute>
                <AdminEventos />
              </ProtectedRoute>
            }
          />

          {/* EVENTOS */}
          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <EventsList />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideChrome && <BottomNav />}
    </div>
  );
}
