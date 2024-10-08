import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Main/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:1312/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data.items);
      } catch (err) {
        setError("Fehler beim Laden der Wunschliste.");
        console.error("Fehler beim Abrufen der Wunschliste:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:1312/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get("http://localhost:1312/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data.items);
    } catch (err) {
      setError("Fehler beim Entfernen des Artikels von der Wunschliste.");
      console.error("Fehler beim Entfernen des Artikels:", err);
    }
  };

  if (loading) return <p>Laden...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto pt-5">
      <div
        className="mx-15 pt-10 p-4 border-0 rounded-md"
        style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
      >
        <div className="max-w-8xl mx-auto p-4 border border-stone-500 bg-stone-600 rounded-md" style={{ width: '90%' }}>
          {wishlist.length > 0 ? (
            <ul className="space-y-4">
              {wishlist.map((item, index) => (
                <li
                key={`${item.productId}-${index}`}
                  className="flex justify-between items-center p-4 border-b border-stone-400"
                >
                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      state={{ fromWishlist: true }}
                      className="text-lg font-semibold text-white hover:underline hover:text-blue-400"
                    >
                      {item.name}
                    </Link>
                    <p className="text-md text-stone-400">{item.price} €</p>
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
            <p className="text-center text-stone-400">Deine Wunschliste ist leer...</p>
          )}
        </div>
        <hr className="border-stone-400 mt-4" />
      </div>
    </div>
  );
};

export default Wishlist;
