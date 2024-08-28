/* eslint-disable no-unused-vars */
import React from 'react';
import { FaRegClock, FaList, FaShippingFast, FaTag } from 'react-icons/fa'; // Importiere die benötigten Icons

const Konto = () => {
  return (
    <div className="w-4/5 mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Anmelden */}
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-4">Anmelden</h3>
        <form>
          <label className="block mb-2">
            E-Mail Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="E-Mail Adresse"
          />
          <label className="block mb-2">
            Passwort <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Passwort"
          />
          <div className="flex justify-between items-center mb-4">
            <div>
              <input type="checkbox" id="showPassword" />
              <label htmlFor="showPassword" className="ml-2">
                Passwort anzeigen
              </label>
            </div>
            <a href="#" className="text-blue-500 text-sm">
              Passwort vergessen?
            </a>
          </div>
          <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Anmelden
          </button>
        </form>
      </div>

      {/* Rechte Spalte: Registrierung und Vorteile */}
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-4">Sie haben kein Konto?</h3>
        <button className="w-full border-2 border-blue-500 text-blue-500 p-2 rounded-lg hover:bg-blue-50">
          Jetzt registrieren!
        </button>
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
