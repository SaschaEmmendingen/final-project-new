import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext';
import { Link } from "react-router-dom";

const GamingPC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        const data = await response.json();
        // Filter products to only include those in the "Gaming PC" category
        const gamingPCs = data.filter(product => product.category === "Gaming PC");
        setProducts(gamingPCs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <h1 className="text-3xl font-bold my-8 text-center">GAMING PC</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-4"
                />
              </Link>
              <h3 className="text-lg font-semibold text-center">
                {product.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md font-medium text-gray-700 text-center">
                {product.price} €
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
              >
                <FaShoppingCart className="inline mr-2" /> In den Warenkorb
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GamingPC;