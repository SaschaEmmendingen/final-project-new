import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fernseher from "./components/Fernseher";
import GamingPC from "./components/GamingPC";
import Handys from "./components/Handys";
import Home from "./components/Main/Home";
import Laptops from "./components/Laptops";
import Kontakt from "./components/Main/Kontakt";
import Konto from "./components/Main/Konto";
import Warenkorb from "./components/Warenkorb";
import PageNotFound from "./components/PageNotFound";
import Parent from "./components/Main/Parent";
import { CartProvider } from "./components/CartContext";
import Login from "./components/Main/Login";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProductDetail from "./components/Order/ProductDetail";
import { AuthProvider } from "./components/Main/AuthContext";
import ProtectedRoute from "./components/Main/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Parent />}>
                <Route index element={<Home />} />
                <Route path="Fernseher" element={<Fernseher />} />
                <Route path="GamingPC" element={<GamingPC />} />
                <Route path="Handys" element={<Handys />} />
                <Route path="Laptops" element={<Laptops />} />
                <Route path="Kontakt" element={<Kontakt />} />
                <Route path="Konto" element={<Konto />} />
                <Route path="/warenkorb" element={<Warenkorb />} />
                <Route path="*" element={<PageNotFound />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/products/:id" element={<ProductDetail />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
