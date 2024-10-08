import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { useCart } from "../CartContext";
import { useAuth } from "../Main/AuthContext";
import canvaSVG from "../../media/Untitled design.svg";

const Parent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State für den Suchbegriff
  const [isSearching, setIsSearching] = useState(false); // State für den Suchvorgang
  const [isLoading, setIsLoading] = useState(false); // State für Ladeanzeige
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();

  const handleLinkClick = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 100); // 500 Millisekunden Verzögerung
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        navigate(`/search?name=${searchTerm}`);
        setSearchTerm(""); // Setzt das Eingabefeld zurück
        setIsSearching(false);
      }, 500); // 500 Millisekunden Verzögerung
    }
  };

  return (
    <div>
      <nav className="bg-stone-800 w-full py-4 sticky top-0 z-50 shadow-lg shadow-stone-600 rounded-b-md border-b border-stone-800">
        <div className="w-full mx-auto px-4 lg:px-8 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* Logo */}
            <div className="flex justify-center items-center lg:justify-start lg:col-span-1 lg-row-span-2 ">
              <Link to="/" className="flex items-center">
              <div className="text-gray-400 border-gray-400 text-6xl logo-font border-b-8"
              style={{  }}>eCOM.com</div>
              </Link>
            </div>

            {/* Suchleiste */}
            <motion.form
              className="hidden lg:flex items-center border-1 text-gray-400 border-black rounded-lg p-1 bg-stone-600 shadow-xl lg:col-span-2"
              onSubmit={handleSearch}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <input
                type="text"
                placeholder="Suche"
                className="outline-none w-full px-2 py-1 bg-stone-600 shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="text-gray-400 pr-3">
                <FaSearch />
              </button>
            </motion.form>

            {/* Icons: Kontakt, Konto, Warenkorb */}
            <div className="flex justify-center lg:justify-end lg:col-span-1 lg:space-x-10">
              <Link
                to="/kontakt"
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleLinkClick("/kontakt")}
              >
                <FaPhone className="text-lg" />
                <span className="mt-3 text-sm">Kontakt</span>
              </Link>
              <Link
                to={
                  user && user.role === "admin"
                    ? "/admin-dashboard"
                    : user
                    ? "/konto"
                    : "/konto"
                }
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() =>
                  handleLinkClick(
                    user && user.role === "admin"
                      ? "/admin-dashboard"
                      : user
                      ? "/konto"
                      : "/konto"
                  )
                }
              >
                <FaUser className="text-lg" />
                <span className="mt-3 text-sm">
                  {user && user.role === "admin"
                    ? "Admin Dashboard"
                    : user
                    ? "Dashboard"
                    : "Konto"}
                </span>
              </Link>

              <Link
                to="/warenkorb"
                className="flex flex-col items-center text-center text-gray-400 hover:text-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleLinkClick("/warenkorb")}
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
            onClick={() => handleLinkClick("/")}
          >
            Home
          </Link>
          <Link
            to="/Fernseher"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => handleLinkClick("/Fernseher")}
          >
            Fernseher
          </Link>
          <Link
            to="/GamingPC"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => handleLinkClick("/GamingPC")}
          >
            Gaming PCs
          </Link>
          <Link
            to="/Handys"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => handleLinkClick("/Handys")}
          >
            Handys
          </Link>
          <Link
            to="/Laptops"
            className="text-center text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => handleLinkClick("/Laptops")}
          >
            Laptops
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`lg:hidden fixed top-4 right-6 z-50 flex flex-col justify-between items-center w-10 h-6 ${
            isMenuOpen ? "open" : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          {isMenuOpen && !isLoading && (
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
                onClick={() => handleLinkClick("/")}
              >
                Home
              </Link>
              <Link
                to="/Fernseher"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={() => handleLinkClick("/Fernseher")}
              >
                Fernseher
              </Link>
              <Link
                to="/GamingPC"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={() => handleLinkClick("/GamingPC")}
              >
                Gaming PCs
              </Link>
              <Link
                to="/Handys"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={() => handleLinkClick("/Handys")}
              >
                Handys
              </Link>
              <Link
                to="/Laptops"
                className="text-2xl hover:text-gray-400 transition-colors duration-300 ease-in-out"
                onClick={() => handleLinkClick("/Laptops")}
              >
                Laptops
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Ladeanzeige */}
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader text-gray-400 pt-8">Laden...</div>{" "}
            {/* Hier kannst du ein Loading-Symbol oder eine Animation verwenden */}
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Parent;
