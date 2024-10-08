import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Main/AuthContext"; // Stelle sicher, dass der AuthContext importiert ist

const UserPayment = () => {
  const { token } = useAuth(); // Hole den Authentifizierungs-Token
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrderIds, setOpenOrderIds] = useState([]); // Zustand für die offenen Rechnungen

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Du bist nicht authentifiziert."); // Fehler setzen, wenn kein Token vorhanden
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:1312/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` }, // Füge den Token hinzu
          }
        );

        console.log("Bestellungen empfangen:", response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError("Die empfangenen Daten sind keine gültigen Bestellungen.");
        }
      } catch (err) {
        console.error("Fehler beim Laden der Bestellungen:", err);
        setError("Fehler beim Laden der Bestellungen");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const toggleOrderVisibility = (orderId) => {
    setOpenOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (loading) {
    return <p>Laden...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div
        className="max-w-lg mx-auto p-4 border-0 bg-stone-800 text-white rounded-md"
        style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
      >
        <p>Keine Rechnungen vorhanden...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 bg-stone-800 text-white rounded-md">
      {orders.map((order) => (
        <div key={order._id} className="mb-4">
          <div
            className="p-4 bg-gray-700 rounded-md cursor-pointer"
            style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
            onClick={() => toggleOrderVisibility(order._id)} // Umschalten der Sichtbarkeit beim Klicken
          >
            <h3 className="text-lg font-semibold">Rechnung #{order._id}</h3>
            <p className="text-green-500">Gesamtbetrag: {order.total} €</p>
            <p>Bestellt am: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          {openOrderIds.includes(order._id) && ( // Überprüfen, ob die Rechnung sichtbar ist
            <div className="mt-2 p-2 bg-stone-600 rounded-md">
              {order.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="text-sm text-white"
                >
                  <p>{item.productId.name}</p>
                  <p>Menge: {item.quantity}</p>
                  <p className="text-green-400 border-b pb-2">Preis: {item.price}€</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserPayment;
