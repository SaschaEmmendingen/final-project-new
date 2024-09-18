import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ProductSearch() {
  const [products, setProducts] = useState(() => {
    // Initialisiere den Zustand mit den gespeicherten Suchergebnissen, falls vorhanden
    const savedProducts = sessionStorage.getItem("searchResults");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate Hook verwenden

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("name");

    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [location.search]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(
        `http://localhost:1312/api/products/search?name=${searchTerm}`
      );
      const results = response.data;
      setProducts(results);
      // Speichere die Suchergebnisse im sessionStorage
      sessionStorage.setItem("searchResults", JSON.stringify(results));
    } catch (error) {
      console.error("Fehler bei der Produktsuche:", error);
    }
  };

  const handleCardClick = (productId) => {
    setTimeout(() => {
      navigate(`/products/${productId}`);
    }, 500); // 500 Millisekunden Verzögerung
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-10">
      <h1
        className="text-3xl font-bold mb-6 text-center text-gray-400 pb-5"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Suchergebnisse
      </h1>

      {/* Liste der Produkte */}
      {products.length > 0 ? (
        <div className="grid grid-cols-4 gap-8 ">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white shadow-md rounded-lg cursor-pointer border-0 border-gray-200 transition-transform duration-300 hover:scale-105"
            //   style={{ background: "linear-gradient(to top, gray, white 10%)" }}
              onClick={() => handleCardClick(product._id)} // handleCardClick verwenden
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-lg">{product.price} €</p>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Keine Produkte gefunden.</p>
      )}
    </div>
  );
}

export default ProductSearch;
