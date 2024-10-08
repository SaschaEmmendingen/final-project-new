import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "./CartContext";
import axios from "axios";
import { Link } from "react-router-dom";
import bannerTV from "../banner/uled-8k-tv-u80g-banner.jpg"; // Füge hier dein Banner-Bild hinzu

const TVs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const [token, setToken] = useState(localStorage.getItem("token")); // Token von localStorage

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        const data = await response.json();
        // Filter products to only include those in the "TVs" category
        const tvs = data.filter((product) => product.category === "TVs");
        setProducts(tvs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, quantity = 1) => {
    console.log("Selected product:", product);
    if (!token) {
      // Handle token absence, e.g., navigate to login
      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl
    });
  };

  const handleAddToWishlist = async (product) => {
    if (!token) {
      // Handle token absence, e.g., navigate to login
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
      console.log("Item added to wishlist:", response.data);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto ">
      <img
        src={bannerTV}
        alt="TVs Banner"
        className="border-gray-400 rounded-md border-0 shadow-2xl shadow-stone-900"
        style={{ height: "500px", width: "100vw" }}
      />
      <h1
        className="text-3xl font-bold my-8 text-center text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        TVs
      </h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 p-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white border-0 border-gray-200 rounded-lg shadow-md p-8 transition-transform duration-300 hover:scale-105"
                style={{ background: "linear-gradient(gray, white 10%)" }}
              >
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-contain mb-4 py-4"
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
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    <FaShoppingCart className="inline mr-2" /> In den Warenkorb
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                  >
                    <FaHeart className="inline mr-2" /> Zur Wunschliste
                    hinzufügen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TVs;
