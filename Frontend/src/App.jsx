import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./pages/Cart.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

import ProducersList from "./pages/ProducersList.jsx";
import ProducerDetail from "./pages/ProducerDetail.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CocktailsList from "./pages/CocktailsList.jsx";
import CocktailDetail from "./pages/CocktailDetail.jsx";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");

  return (
    <div className="app-container">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
      />

      <main className="main-content">
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={<Home searchTerm={searchTerm} category={category} />}
          />

          {/* BOTTOM NAV */}
          <Route path="/buscar" element={<Search />} />
          <Route path="/carrito" element={<Cart />} />

          {/* PROTEGIDAS (requieren login) */}
          <Route
            path="/productores"
            element={
              <ProtectedRoute>
                <ProducersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productores/:producerId"
            element={
              <ProtectedRoute>
                <ProducerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skus/:productId"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cocteles"
            element={
              <ProtectedRoute>
                <CocktailsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cocteles/:cocktailId"
            element={
              <ProtectedRoute>
                <CocktailDetail />
              </ProtectedRoute>
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
