import React, { useEffect, useState } from "react";
import ProductManagement from "../Order/ProductManagment";
import AdminProfile from "./AdminProfile";
import UserManagment from "../User/UserManagment";
import OrderManagment from "../Order/OrderManagmentAdmin";
import { useNavigate } from "react-router-dom";
import RetourenManagement from "../Order/RetourenManagement";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("userInfo");

    console.log("Stored Role on Dashboard Load:", storedRole);
    console.log("Stored User Info on Dashboard Load:", storedUser);

    setRole(storedRole || "Unbekannt");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    if (storedRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

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
      case "retoure":
        return <RetourenManagement />;
      default:
        return (
          <div className="text-gray-400">
            Willkommen im Admin Dashboard{user ? `, ${user.name}!` : "!"}
          </div>
        );
    }
  };

  const handleViewChange = (view) => {
    setLoading(true);
    setTimeout(() => {
      setActiveView(view);
      setLoading(false);
    }, 100); // Delay von 100 Millisekunden
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div
      className="w-4/5 mx-auto mt-8 p-8 shadow-lg rounded-lg border border-stone-600"
      style={{ background: "linear-gradient(#78716c, #44403c 10%)" }}
    >
      <h3
        className="text-2xl pt-4 font-bold mb-4 text-center text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Admin Dashboard
      </h3>
      <div className="flex">
        {/* Sidebar Buttons */}
        <div className="w-1/8 flex flex-col gap-2 pt-8">
          <button
            className={`p-2 rounded ${
              activeView === "profile" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("profile")}
          >
            Profil
          </button>
          <button
            className={`p-2 rounded ${
              activeView === "user" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("user")}
          >
            User Verwaltung
          </button>
          <button
            className={`p-2 rounded ${
              activeView === "product" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("product")}
          >
            Produkt Verwaltung
          </button>
          <button
            className={`p-2 rounded ${
              activeView === "orders" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("orders")}
          >
            Bestellungen
          </button>
          <button
            className={`p-2 rounded ${
              activeView === "retoure" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("retoure")}
          >
            Retouren Verwaltung
          </button>
          <button
            className={`p-2 rounded ${
              activeView === "retoure" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleViewChange("retoure")}
          >
            Support Verwaltung
          </button>
          <button
            className="mt-64 bg-red-600 border text-gray-400 p-1 w-20 border-red-600 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
          <p className=" text-sm text-green-600">
            <strong>Eingeloggt:</strong> {user?.name || "Unbekannt"}
          </p>
        </div>

        {/* Main Content */}
        <div className="w-3/4 m-5 p-4 border-l-2 border-stone-600">
          {loading ? <p className="text-gray-400">Laden...</p> : renderView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
