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
import Logout from "./components/Main/Logout";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProductDetail from "./components/Order/ProductDetail";
import { AuthProvider } from "./components/Main/AuthContext";
import ProtectedRoute from "./components/Main/ProtectedRoute";
import OrderManagmentUser from "../src/components/Order/OrderManagmentUser";
import "./index.css";
import Retoure from "./components/User/Retoure";
import ProductSearch from "./components/Main/ProductSearch"; // Importieren der ProductSearch-Komponente
import { NotificationProvider } from './components/Main/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
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
                  <Route path="Warenkorb" element={<Warenkorb />} />
                  <Route path="*" element={<PageNotFound />} />
                  <Route path="orders" element={<OrderManagmentUser />} />
                  <Route path="retoure" element={<Retoure />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<UserDashboard />} />}
                  />
                  <Route
                    path="/admin-dashboard"
                    element={<ProtectedRoute element={<AdminDashboard />} />}
                  />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/search" element={<ProductSearch />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
