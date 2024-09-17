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
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found.");
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
  }, []);

  const handleButtonClick = async (section) => {
    console.log(`Button clicked: ${section}`); // Debugging line
    await delay(500); // Verzögerung von 0.5 Sekunden
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Laden...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!user) return <p>User nicht gefunden.</p>;

  const renderSection = () => {
    console.log(`Rendering section: ${activeSection}`); // Debugging line
    switch (activeSection) {
      case "profile":
        return <UserProfile user={user} />;
      case "orders":
        return <OrderManagmentUser />;
      case "button3":
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
        return <p>default</p>;
    }
  };

  return (
    <div
      className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg border border-gray-400"
      style={{ background: "linear-gradient(gray, white 10%)" }}
    >
      <h3 className="text-xl font-bold mb-4">Willkommen, {user.name}!</h3>
      <div className="flex">
        {/* Sidebar Buttons */}
        <div className="w-1/8 flex flex-col gap-2">
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("profile")}
          >
            Profil
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("orders")}
          >
            Bestellungen
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("button3")}
          >
            Retoure
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("wishlist")}
          >
            Wunschliste
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("notifications")}
          >
            Nachrichten
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("support")}
          >
            Support
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("payment")}
          >
            Rechnungen
          </button>
          <button
            className="p-2 rounded text-white bg-stone-800 border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => handleButtonClick("activities")}
          >
            Benutzer Aktivitäten
          </button>
          <button
            className="mt-4 bg-red-600 border text-white p-2 border-pink-300 rounded"
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
