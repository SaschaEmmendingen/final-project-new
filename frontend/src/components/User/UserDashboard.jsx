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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found.");
        setLoading(false);
        return;
      }

      try {
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
        return <p>Please select an option.</p>;
    }
  };

  const handleButtonClick = (section) => {
    console.log(`Button clicked: ${section}`); // Debugging line
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg border border-blue-600">
      <h3 className="text-xl font-bold mb-4">Welcome, {user.name}!</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "red" }}
          onClick={() => handleButtonClick("profile")}
        >
          Profil
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "orange", color: "black" }}
          onClick={() => handleButtonClick("orders")}
        >
          Bestellungen
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "yellow", color: "black" }}
          onClick={() => handleButtonClick("button3")}
        >
          Retoure
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "green" }}
          onClick={() => handleButtonClick("wishlist")}
        >
          Wunschliste
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "blue" }}
          onClick={() => handleButtonClick("notifications")}
        >
          Nachrichten
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "indigo" }}
          onClick={() => handleButtonClick("support")}
        >
          Support
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "violet" }}
          onClick={() => handleButtonClick("payment")}
        >
          Rechungen
        </button>
        <button
          className="flex-1 p-2 rounded text-white border border-transparent transition-transform duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "pink" }}
          onClick={() => handleButtonClick("activities")}
        >
          Benutzer Aktivitäten
        </button>
      </div>
      <button
        className="bg-red-600 border text-white p-2 mb-2 border-pink-300 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="mt-4 p-4 border-t border-red-600">{renderSection()}</div>
    </div>
  );
};

export default UserDashboard;
