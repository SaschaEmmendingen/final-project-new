import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Main/AuthContext";
import Registrierung from "../Register";
import Login from "./Login";
import { FaRegClock, FaList, FaShippingFast, FaTag } from "react-icons/fa";

const Konto = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { token, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Token:", token); // Debugging-Anweisung
    console.log("Role:", role); // Debugging-Anweisung

    if (token) {
      if (role === "admin") {
        console.log("Navigating to admin-dashboard"); // Debugging-Anweisung
        navigate("/admin-dashboard");
      } else if (role === "user") {
        console.log("Navigating to dashboard"); // Debugging-Anweisung
        navigate("/dashboard");
      }
    }
  }, [token, role, navigate]);

  return (
    <div className="w-4/5 mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Formular je nach Zustand */}
      <div className="bg-stone-800 p-8 shadow-lg rounded-lg">
        {isRegistering ? (
          <>
            <h3 className="text-xl font-bold mb-4 text-gray-400">
              Registrieren
            </h3>
            <Registrierung />
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4 text-gray-400">Anmelden</h3>
            <Login />
          </>
        )}
      </div>

      {/* Rechte Spalte: Registrierung und Vorteile */}
      <div className="bg-stone-800 p-8 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-400">
          Sie haben kein Konto?
        </h3>
        {isRegistering ? (
          <button
            onClick={() => setIsRegistering(false)}
            className="w-full border-2 border-gray-400 text-gray-400 p-2 rounded-lg hover:bg-stone-900"
          >
            Zurück zur Anmeldung
          </button>
        ) : (
          <button
            onClick={() => setIsRegistering(true)}
            className="w-full border-2 border-gray-400 text-gray-400 p-2 rounded-lg hover:bg-stone-900"
          >
            Jetzt registrieren!
          </button>
        )}
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-4 text-gray-400">
            Warum sollten Sie ein Konto haben?
          </h4>
          <ul className="space-y-4">
            <li className="flex items-center">
              <FaShippingFast className="w-6 h-6 mr-2 text-gray-400" />
              <div className="text-gray-400">Schneller bestellen</div>
            </li>
            <li className="flex items-center">
              <FaList className="w-6 h-6 mr-2 text-gray-400" />
              <div className="text-gray-400">
                Erstellen Sie Listen Ihrer Lieblingsprodukte
              </div>
            </li>
            <li className="flex items-center">
              <FaRegClock className="w-6 h-6 mr-2 text-gray-400" />
              <div className="text-gray-400">Informationen zur Bestellung</div>
            </li>
            <li className="flex items-center">
              <FaTag className="w-6 h-6 mr-2 text-gray-400" />
              <div className="text-gray-400">Rabatte und Sonderaktionen</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Konto;
