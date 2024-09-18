import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { useCart } from "../CartContext";
import { useAuth } from "../Main/AuthContext"; // Importieren Sie useAuth
import canvaSVG from "../../media/Untitled design.svg";

const Parent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, role } = useAuth(); // Holen Sie Benutzer und Rolle aus dem AuthContext

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <nav className="bg-stone-800 w-full py-4 sticky top-0 z-50 shadow-lg shadow-stone-600 rounded-b-md border-b border-stone-800">
        <div className="w-full mx-auto px-4 lg:px-8 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* Logo */}
            <div className="flex justify-center items-center lg:justify-start lg:col-span-1 lg-row-span-2 ">
              <Link to="/" className="flex items-center">
                <img
                  src={canvaSVG}
                  alt="Logo"
                  className="h-20 w-auto items-center"
                />
              </Link>
            </div>

            {/* Suchleiste (nur auf Desktop sichtbar) */}
            <motion.div
              className="hidden lg:flex items-center border-1 text-gray-400 border-black rounded-lg p-1 bg-stone-600 shadow-xl lg:col-span-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <input
                type="text"
                placeholder="Suche"
                className="outline-none w-full px-2 py-1 bg-stone-600 shadow-xl"
              />
              <button className="text-gray-400 pr-3">
                <FaSearch />
              </button>
            </motion.div>

            {/* Icons: Kontakt, Konto, Warenkorb */}
            <div className="flex justify-center lg:justify-end lg:col-span-1 lg:space-x-10 relative">
              <Link
                to="/kontakt"
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <FaPhone className="text-lg" />
                <span className="mt-3 text-sm">Kontakt</span>
              </Link>
              <Link
                to={user ? "/dashboard" : "/konto"}
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <FaUser className="text-lg" />
                <span className="mt-3 text-sm">
                  {user ? "Dashboard" : "Konto"}
                </span>
              </Link>
              <Link
                to="/warenkorb"
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <FaShoppingCart className="text-lg" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                    {cartItems.length}
                  </span>
                )}
                <span className="mt-3 text-sm">Warenkorb</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Links für Desktop (nur sichtbar auf größeren Bildschirmen) */}
        <div className="hidden lg:w-1/2 lg:mx-auto lg:py-4 lg:flex lg:grid lg:grid-cols-5 lg:gap-2 lg:justify-items-center">
          <Link
            to="/"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/Fernseher"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            Fernseher
          </Link>
          <Link
            to="/GamingPC"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            Gaming PCs
          </Link>
          <Link
            to="/Handys"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            Handys
          </Link>
          <Link
            to="/Laptops"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            Laptops
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`lg:hidden fixed top-4 right-6 z-50 flex flex-col justify-between items-center w-10 h-6 ${
            isMenuOpen ? "open" : ""
          }`}
          onClick={handleMenuToggle}
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-black transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-8 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <Link
                to="/"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link
                to="/Fernseher"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={handleLinkClick}
              >
                Fernseher
              </Link>
              <Link
                to="/GamingPC"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={handleLinkClick}
              >
                Gaming PC
              </Link>
              <Link
                to="/Handys"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={handleLinkClick}
              >
                Handys
              </Link>
              <Link
                to="/Laptops"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={handleLinkClick}
              >
                Laptops
              </Link>
              {/* Icons */}
              <div className="flex space-x-8 mt-8">
                <Link
                  to="/kontakt"
                  className="text-white hover:text-gray-400 flex flex-col items-center"
                  onClick={handleLinkClick}
                >
                  <FaPhone className="text-3xl" />
                  <span className="mt-2 text-sm">Kontakt</span>
                </Link>
                <Link
                  to="/konto"
                  className="text-white hover:text-gray-400 flex flex-col items-center"
                  onClick={handleLinkClick}
                >
                  <FaUser className="text-3xl" />
                  <span className="mt-2 text-sm">Konto</span>
                </Link>
                <Link
                  to="/warenkorb"
                  className="text-white hover:text-gray-400 flex flex-col items-center"
                  onClick={handleLinkClick}
                >
                  <FaShoppingCart className="text-3xl" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                      {cartItems.length}
                    </span>
                  )}
                  <span className="mt-2 text-sm">Warenkorb</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Parent;
