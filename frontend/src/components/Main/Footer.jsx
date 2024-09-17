import React from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom"; // Verwende Link für das Routing

const Footer = () => {
  return (
    <footer className="bg-stone-800 text-gray-800 py-8 mt-9">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Bestellungen */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-400 ">
              Bestellungen
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/konto" className="text-gray-400 hover:text-gray-700">
                  Mein Konto
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-gray-700">
                  Meine Bestellungen
                </Link>
              </li>
              <li>
                <Link to="/warenkorb" className="text-gray-400 hover:text-gray-700">
                  Warenkorb
                </Link>
              </li>
              <li>
                <Link to="/retoure" className="text-gray-400 hover:text-gray-700">
                  Rücksendungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Informationen */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-400">
              Informationen
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gray-700">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-gray-700">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-gray-700">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-gray-700">
                  Hilfe & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Ihr Konto */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-400">
              Ihr Konto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-gray-700">
                  Anmelden
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-gray-700">
                  Registrieren
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="text-gray-400 hover:text-gray-700">
                  Passwort vergessen
                </Link>
              </li>
            </ul>
          </div>

          {/* Electro-Ecom */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-400 ">
              Electro-Ecom
            </h3>
            <p className="text-gray-400">
              Wir bieten Ihnen die besten Elektronikprodukte zu unschlagbaren
              Preisen.
            </p>
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Electro-Ecom
            </p>
          </div>

          {/* Kontakt */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-400 ">
              Kontakt
            </h3>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <FaPhone className="mr-2 text-gray-400 " />
              <a
                href="tel:+123456789"
                className="text-gray-400 hover:text-gray-700"
              >
                +123 456 789
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <FaEnvelope className="mr-2 text-gray-400 " />
              <a
                href="mailto:info@electro-ecom.com"
                className="text-gray-400 hover:text-gray-700"
              >
                info@electro-ecom.com
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start mb-2 text-gray-400 ">
              <FaMapMarkerAlt className="mr-2" />
              <span>123 Elektronikstraße, Berlin</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-gray-400 ">
              <FaClock className="mr-2" />
              <span>Mo-Fr: 9:00 - 18:00</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 my-8"></div>

        <div className="text-center text-sm text-gray-400">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Electro-Ecom. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;