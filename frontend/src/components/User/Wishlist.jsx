import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:1312/api/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWishlist(response.data.items);
      } catch (err) {
        setError("Error loading wishlist.");
        console.error(
          "Fetch Wishlist Error:",
          err.response ? err.response.data : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:1312/api/wishlist/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Refresh wishlist
      const response = await axios.get("http://localhost:1312/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(response.data.items);
    } catch (err) {
      setError("Error removing item from wishlist.");
      console.error(
        "Remove Item Error:",
        err.response ? err.response.data : err.message
      );
    }
  };

  if (loading) return <p>Laden...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold my-8 text-center">Wunschliste</h1>
      <div className="max-w-lg mx-auto p-4 border-2 border-pink-500 rounded-md">
        {" "}
        {wishlist.length > 0 ? (
          <ul className="space-y-4">
            {wishlist.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between items-center p-4 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-md text-gray-700">{item.price} €</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Deine Wunschliste ist leer...</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
