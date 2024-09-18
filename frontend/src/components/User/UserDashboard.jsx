import React, { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "./UserProfile";
import OrderManagmentUser from "../Order/OrderManagmentUser";
import Retoure from "./Retoure";
import Wishlist from "./Wishlist";
import Notifications from "./Notifications";
import UserSupport from "./UserSupport";
import UserPayment from "./UserPayment";
import Activities from "./Activities";
import Logout from "../Main/Logout";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // navigate("/konto");
        setLoading(false);
        return;
      }

      try {
        await delay(2000); // Verzögerung von 2 Sekunden
        const response = await axios.get(
          "http://localhost:1312/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.data.user);
      } catch (err) {
        setError("Error loading dashboard.");
        console.error(
          "Fetch User Profile Error:",
          err.response ? err.response.data : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleButtonClick = async (section) => {
    await delay(100); // Verzögerung von 0.1 Sekunden
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate(<Logout />);
  };

  if (loading) return <p className="text-gray-400">Laden...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!user) return <p>User nicht gefunden.</p>;

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <UserProfile user={user} />;
      case "orders":
        return <OrderManagmentUser />;
      case "retoure":
        return <Retoure />;
      case "wishlist":
        return <Wishlist />;
      case "notifications":
        return <Notifications />;
      case "support":
        return <UserSupport />;
      case "payment":
        return <UserPayment />;
      case "activities":
        return <Activities />;
      default:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-400">
              Willkommen, {user.name}!
            </h3>
          </div>
        );
    }
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
        User Dashboard
      </h3>
      <div className="flex">
        {/* Sidebar Buttons */}
        <div className="w-1/8 flex flex-col gap-2 pt-8">
          <button
            className={`p-2 rounded ${
              activeSection === "profile" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("profile")}
          >
            Profil
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "orders" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("orders")}
          >
            Bestellungen
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "retoure" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("retoure")}
          >
            Retoure
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "wishlist" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("wishlist")}
          >
            Wunschliste
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "notifications"
                ? "text-gray-600"
                : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("notifications")}
          >
            Nachrichten
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "support" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("support")}
          >
            Support
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "payment" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("payment")}
          >
            Rechnungen
          </button>
          <button
            className={`p-2 rounded ${
              activeSection === "activities" ? "text-gray-600" : "text-gray-400"
            } bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:text-white hover:scale-105`}
            onClick={() => handleButtonClick("activities")}
          >
            Benutzer Aktivitäten
          </button>
          <button
            className="mt-32 bg-red-600 border text-gray-400 p-1 w-20 border-red-600 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="w-3/4 m-5 p-4 border-l-2 border-stone-600">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
