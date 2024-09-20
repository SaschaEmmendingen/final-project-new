import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaTimes } from "react-icons/fa";
import axios from "axios";
import Modal from "./Modal"; // Importiere die Modal-Komponente

function ProductDetail() {
  const { id } = useParams(); // Holt die Produkt-ID aus der URL
  const [product, setProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); // Token von localStorage
  const [showModal, setShowModal] = useState(false); // State für Modal Sichtbarkeit
  const navigate = useNavigate(); // Hook zum Navigieren

  // Funktion zum Zurücknavigieren
  const handleClose = () => {
    navigate(-1); // Gehe zur vorherigen Seite zurück
  };

  useEffect(() => {
    // Holt die Produktdetails von der API
    fetch(`http://localhost:1312/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Fehler beim Laden des Produkts:", error)
      );
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Zeigt einen Ladeindikator an, bis die Daten geladen sind
  }

  const handleAddToCart = (quantity = 1) => {
    if (!token) {
      // Token nicht vorhanden, Benutzer zur Anmeldung weiterleiten
      return;
    }
    // Logik zum Hinzufügen zum Warenkorb
    console.log("In den Warenkorb legen:", product);
  };

  const handleAddToWishlist = async () => {
    if (!token) {
      // Token nicht vorhanden, Benutzer zur Anmeldung weiterleiten
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:1312/api/wishlist/add",
        {
          productId: product._id,
          name: product.name,
          price: product.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Produkt zur Wunschliste hinzugefügt:", response.data);
    } catch (error) {
      console.error("Fehler beim Hinzufügen zur Wunschliste:", error);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[80vh] pt-6">
      <div
        className="relative w-full md:w-3/4 lg:w-[90vw] h-auto p-8 bg-white shadow-md border-gray-200 rounded-lg"
        style={{ background: "linear-gradient(gray, white 10%)" }}
      >
        {/* Schließen-Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        <h1
          className="text-4xl font-bold mb-6 text-center text-stone-800"
          style={{ textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          {product.name}
        </h1>

        {/* Produktbild und Details nebeneinander */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-24">
          {/* Produktbild */}
          {product.imageUrl && (
            <div className="flex justify-center mb-8">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover cursor-pointer ml-24"
                onClick={() => setShowModal(true)} // Zeige das Modal an
              />
            </div>
          )}

          {/* Produktdetails */}
          <div className="text-stone-800 flex flex-col ml-24 mt-5">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-stone-800">
                Preis
              </h2>
              <p className="text-stone-800">{product.price} €</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-stone-800">
                Kategorie
              </h2>
              <p className="text-stone-800">{product.category}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-stone-800">
                Beschreibung
              </h2>
              <p className="text-stone-800">{product.description}</p>
            </div>
            {/* Buttons Container */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white w-3/5 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                <FaShoppingCart className="inline mr-2" /> In den Warenkorb
              </button>
              <button
                onClick={handleAddToWishlist}
                className="bg-red-500 text-white w-3/5 py-2 rounded-lg shadow-md hover:bg-red-600"
              >
                <FaHeart className="inline mr-2" /> Zur Wunschliste hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal für Bildanzeige */}
      {showModal && (
        <Modal
          imageUrl={product.imageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ProductDetail;
