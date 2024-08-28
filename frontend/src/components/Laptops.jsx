import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const Laptops = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const token = useState();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        const data = await response.json();
        // Filter products to only include those in the "Laptops" category
        const laptops = data.filter(
          (product) => product.category === "Laptops"
        );
        setProducts(laptops);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, quantity = 1) => {
    console.log("Selected product:", product); // Überprüfe, welches Produkt übergeben wird
    if (!token) {
      // navigate("/login");

      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  };

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <h1 className="text-3xl font-bold my-8 text-center">Laptops</h1>

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
                onClick={() => handleAddToCart(product)}
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
};

export default Laptops;
