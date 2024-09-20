import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import { useCart } from "../CartContext";
import axios from "axios";
import FirstBanner from "../../banner/FirstBanner.jpg";
import SecondBanner from "../../banner/SecondBanner.jpg";
import ThirdBanner from "../../banner/ThirdBanner.jpg";
import FourthBanner from "../../banner/FourthBanner.jpg";
import FifthBanner from "../../banner/FifthBanner.jpg";
import SixthBanner from "../../banner/SeventhBanner.jpg";

const images = [
  FirstBanner,
  SecondBanner,
  ThirdBanner,
  FourthBanner,
  FifthBanner,
  SixthBanner,
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        const data = await response.json();
        setProducts(data);
        setRecommendedProducts(getRandomProducts(data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const getRandomIndex = () => Math.floor(Math.random() * images.length);

    const changeBanner = () => {
      setCurrentIndex(getRandomIndex());
    };

    const id = setInterval(changeBanner, 5000);
    return () => clearInterval(id);
  }, []);

  // Funktion zum Zufallsauswählen von 6 Produkten
  const getRandomProducts = (products, count = 6) => {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
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
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Bild ${currentIndex + 1}`}
        className="border-gray-400 rounded-md border-0 shadow-2xl shadow-stone-900"
        style={{ height: "500px", width: "100vw", objectFit: "cover" }}
      />
      <h1
        className="text-3xl font-bold my-8 text-center text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Empfohlene Produkte
      </h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 p-4">
          {recommendedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border-0 border-gray-200 rounded-lg shadow-md p-8 transition-transform duration-300 hover:scale-105"
              style={{ background: "linear-gradient(gray, white 10%)" }}
            >
              <a href={`/products/${product._id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-4 py-4"
                />
              </a>
              <h3 className="text-lg font-semibold text-center text-stone-800">
                {product.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md font-medium text-stone-800 text-center">
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
                  <FaHeart className="inline mr-2" /> Zur Wunschliste hinzufügen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
