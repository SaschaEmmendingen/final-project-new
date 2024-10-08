import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importiere den useNavigate Hook

const AdminBestellungen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate(); // Initialisiere den navigate Hook

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:1312/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:1312/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const toggleOrderItems = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading)
    return <p className="text-gray-400">Bestellungen werden geladen...</p>;
  if (error)
    return (
      <p className="text-red-500">
        Fehler: {error.message || "Unbekannter Fehler"}
      </p>
    );

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-4 text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Bestellungen
      </h1>
      {orders.length === 0 ? (
        <p>Keine Bestellungen vorhanden.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
              style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
            >
              <div className="flex justify-between items-center text-gray-400">
                <div>
                  <h3 className="text-lg font-medium">
                    Bestellung #{order._id}
                  </h3>
                  <p className="text-base">
                    Erstellt von:{" "}
                    <span className="font-bold text-orange-500">
                      {order.user ? order.user.name : "Unbekannt"}
                    </span>
                  </p>
                  <p className="text-base font-bold">
                    Gesamtbetrag: {order.total} €
                  </p>
                </div>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => toggleOrderItems(order._id)}
                >
                  {expandedOrders[order._id] ? "▲" : "▼"}
                </button>
              </div>

              {expandedOrders[order._id] && (
                <ul className="mt-2 text-white">
                  {order.items.map((item) => (
                    <li key={item._id} className="border-b py-1">
                      {/* Verlinke den Produktnamen */}
                      <span
                        onClick={() => navigate(`/products/${item.productId._id}`)} // Navigiere zur Produktdetailseite
                        className="cursor-pointer hover:text-blue-300"
                      >
                        {item.productId.name}
                      </span>{" "}
                      - {item.price} €
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="bg-red-600 text-red-200 py-1 mt-4 px-2 rounded hover:bg-red-900"
                onClick={() => handleDeleteOrder(order._id)}
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminBestellungen;
