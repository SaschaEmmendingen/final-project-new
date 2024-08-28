import React, { useEffect, useState } from "react";
import ProductManagement from "../Order/ProductManagment";
import AdminProfile from "./AdminProfile";
import UserManagment from "../User/UserManagment";
import OrderManagment from "../Order/OrderManagmentAdmin";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "Unbekannt");
  }, []);
  const renderView = () => {
    switch (activeView) {
      case "product":
        return <ProductManagement />;
      case "profile":
        return <AdminProfile />;
      case "user":
        return <UserManagment />;
      case "orders":
        return <OrderManagment />;
      // Füge weitere Cases für andere Ansichten hinzu
      default:
        return <div>Willkommen im Admin Dashboard</div>;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Entferne das Token aus dem lokalen Speicher
    navigate("/login"); // Leite den Benutzer zur Anmeldeseite um
  };

  return (
    <div className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg border border-blue-400">
      <h3 className="text-xl font-bold mb-4">Admin Dashboard</h3>
      <p className="mb-4">
        <strong>Rolle:</strong> {role}
      </p>
      <button
        onClick={() => setActiveView("profile")}
        className="bg-pink-400 text-white py-2 px-4 rounded my-1"
      >
        Profil
      </button>
      <br />
      <button
        onClick={() => setActiveView("user")}
        className="bg-blue-500 text-white py-2 px-4 rounded my-1"
      >
        User Verwaltung
      </button>
      <br />
      <button
        onClick={() => setActiveView("product")}
        className="bg-red-600 text-white py-2 px-4 rounded my-1"
      >
        Produkt Verwaltung
      </button>
      <br />
      <button
        onClick={() => setActiveView("orders")}
        className="bg-green-600 text-white py-2 px-4 rounded my-1"
      >
        Bestellungen
      </button>
      <br />
      <button
        className="bg-red-600 border text-white p-2 mb-2 border-pink-400 rounded"
        onClick={handleLogout} // Logout-Funktion aufrufen
      >
        Logout
      </button>
      {/* Weitere Admin-Funktionen hier */}
      <div className="mt-8">{renderView()}</div>
    </div>
  );
};

export default AdminDashboard;
