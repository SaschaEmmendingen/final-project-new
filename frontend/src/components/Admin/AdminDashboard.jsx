import React, { useEffect, useState } from "react";
import ProductManagement from "../Order/ProductManagment";
import AdminProfile from "./AdminProfile";
import UserManagment from "../User/UserManagment";
import OrderManagment from "../Order/OrderManagmentAdmin";
import { useNavigate } from "react-router-dom";
import RetourenManagement from "../Order/RetourenManagement";
import AdminNotifications from "./AdminNotifications";
import AdminSupport from "./AdminSupport";
import logo from "../../banner/logo.webp"

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState(
    localStorage.getItem("activeView") || "dashboard"
  );
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
      navigate("/konto");
    }
  }, [navigate]);

  const handleViewChange = (view) => {
    setLoading(true);
    setTimeout(() => {
      setActiveView(view);
      localStorage.setItem("activeView", view);
      setLoading(false);
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("activeView");
    navigate("/");
    window.location.reload();
  };

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
      case "support":
        return <AdminSupport />;
      case "notifications":
        return <AdminNotifications />;
      default:
        return (
          <div className="text-gray-400">
            Willkommen im Admin Dashboard{user ? `, ${user.name}!` : "!"}
          </div>
        );
    }
  };

  return (
    <div
      className="w-4/5 mx-auto mt-8 p-8 shadow-lg rounded-lg border border-stone-600"
      style={{
        background: "linear-gradient(#78716c, #44403c 10%)",
        position: "relative",
        minHeight: "80vh",
      }}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-2/8 flex flex-col">
          <div className="flex flex-col gap-2 pt-8 flex-grow">
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
                activeView === "notifications"
                  ? "text-gray-600"
                  : "text-gray-400"
              } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
              onClick={() => handleViewChange("notifications")}
            >
              Nachrichten
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-[80vw] m-5 p-4 border-l-2 border-stone-600">
          <div className="flex flex-col items-center pb-5">
            {/* Logo über der Überschrift und dem gerenderten Inhalt */}
            <img src={logo} alt="Logo" className="rounded-md border-0 shadow-2xl shadow-stone-900" style={ {height: "45vh", width:"60vw"} }/>
          </div>

          {loading ? <p className="text-gray-400">Laden...</p> : renderView()}
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4">
        <button
          className="bg-red-600 text-gray-400 p-2 w-full max-w-xs border border-red-600 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
