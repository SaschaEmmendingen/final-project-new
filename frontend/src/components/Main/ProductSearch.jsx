import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ProductSearch() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("name");

    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [location.search]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:1312/api/products/search?name=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Fehler bei der Produktsuche:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">Suchergebnisse</h1>

      {/* Liste der Produkte */}
      {products.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="p-4 bg-white shadow-md rounded-lg">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-lg">{product.price} €</p>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Keine Produkte gefunden.</p>
      )}
    </div>
  );
}

export default ProductSearch;
