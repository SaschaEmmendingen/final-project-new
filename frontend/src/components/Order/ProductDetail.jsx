import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams(); // Holt die Produkt-ID aus der URL
  const [product, setProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); // Token von localStorage

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
    <div className="flex justify-center items-center min-h-screen pt-8">
      <div
        className="w-4/5 md:w-3/5 lg:w-4/5 h-auto p-10 bg-white shadow-md border-gray-200 rounded-lg"
        style={{ background: "linear-gradient(gray, white 10%)" }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">
          {product.name}
        </h1>

        {/* Produktbild und Details nebeneinander */}
        <div className="grid grid-cols-2 gap-8">
          {/* Produktbild */}
          {product.imageUrl && (
            <div className="flex justify-center mb-6 pt-7">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-3/4 h-auto object-cover"
              />
            </div>
          )}

          {/* Produktdetails */}
          <div className="text-stone-800">
            <div>
              <h2 className="text-xl font-semibold mb-2">Preis</h2>
              <p>{product.price} €</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Kategorie</h2>
              <p>{product.category}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Buttons für Warenkorb und Wunschliste */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            <FaShoppingCart className="inline mr-2" /> In den Warenkorb
          </button>
          <button
            onClick={handleAddToWishlist}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            <FaHeart className="inline mr-2" /> Zur Wunschliste hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
