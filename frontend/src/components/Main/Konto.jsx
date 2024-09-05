import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Main/AuthContext'; // AuthContext importieren
import Registrierung from '../Register';
import Login from './Login';
import { FaRegClock, FaList, FaShippingFast, FaTag } from 'react-icons/fa';

const Konto = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { token, role } = useAuth(); // Token und Role aus dem AuthContext holen
  const navigate = useNavigate();

  useEffect(() => {
    // Wenn der Benutzer eingeloggt ist, leite ihn abhängig von seiner Rolle weiter
    if (token) {
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'user') {
        navigate('/dashboard');
      }
    }
  }, [token, role, navigate]);

  return (
    <div className="w-4/5 mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Formular je nach Zustand */}
      <div className="bg-white p-8 shadow-lg rounded-lg">
        {isRegistering ? (
          <>
            <h3 className="text-xl font-bold mb-4">Registrieren</h3>
            <Registrierung />
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4">Anmelden</h3>
            <Login />
          </>
        )}
      </div>

      {/* Rechte Spalte: Registrierung und Vorteile */}
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-4">Sie haben kein Konto?</h3>
        {isRegistering ? (
          <button
            onClick={() => setIsRegistering(false)}
            className="w-full border-2 border-blue-500 text-blue-500 p-2 rounded-lg hover:bg-blue-50"
          >
            Zurück zur Anmeldung
          </button>
        ) : (
          <button
            onClick={() => setIsRegistering(true)}
            className="w-full border-2 border-blue-500 text-blue-500 p-2 rounded-lg hover:bg-blue-50"
          >
            Jetzt registrieren!
          </button>
        )}
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-4">Warum sollten Sie ein Konto haben?</h4>
          <ul className="space-y-4">
            <li className="flex items-center">
              <FaShippingFast className="w-6 h-6 mr-2" />
              Schneller bestellen
            </li>
            <li className="flex items-center">
              <FaList className="w-6 h-6 mr-2" />
              Erstellen Sie Listen Ihrer Lieblingsprodukte
            </li>
            <li className="flex items-center">
              <FaRegClock className="w-6 h-6 mr-2" />
              Informationen zur Bestellung
            </li>
            <li className="flex items-center">
              <FaTag className="w-6 h-6 mr-2" />
              Rabatte und Sonderaktionen
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Konto;