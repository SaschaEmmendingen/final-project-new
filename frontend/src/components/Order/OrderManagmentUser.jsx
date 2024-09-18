import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../Main/AuthContext";
import { Link } from "react-router-dom"; // Importiere Link von react-router-dom

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // State für die ausgeklappte Bestellung
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:1312/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Fetched Orders with Returns:", data); // Prüfe hier die Daten
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:1312/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Remove the deleted order from the state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const formatOrderId = (id) => `Order #${id}`;

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center pt-4">
        <div className="w-3/5 mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          Du musst eingeloggt sein, um deine Bestellungen zu sehen. Bitte{" "}
          <a href="/login" className="text-blue-500 underline">
            logge dich hier ein
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto pt-5">
      {loading ? (
        <div className="text-center">Laden...</div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="mx-15 p-4 border-0 rounded-md"
                style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
              >
                <div
                  className="cursor-pointer flex justify-between"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {formatOrderId(order._id)}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Verhindert, dass der Klick das Ausklappen auslöst
                      handleDeleteOrder(order._id);
                    }}
                    className="bg-red-600 text-white py-2 px-4 rounded flex items-center space-x-2"
                  >
                    <FaTrashAlt className="mr-2" />
                    Löschen
                  </button>
                </div>
                {expandedOrderId === order._id && (
                  <div className="mt-4">
                    <p className="text-md text-green-700 font-bold">
                      Total: {order.total} €
                    </p>
                    <ul className="mt-4">
                      {order.items.map((item) => {
                        // Prüfen, ob das Item in den Rücksendungen enthalten ist
                        const isReturned = order.returns.some((returnItem) =>
                          returnItem.items.some(
                            (returnedItem) =>
                              returnedItem.productId.toString() ===
                              item.productId._id
                          )
                        );

                        console.log(
                          "Item:",
                          item.productId.name,
                          "Returned:",
                          isReturned
                        ); // Console Log hier

                        return (
                          <li
                            key={item.productId._id}
                            className={`flex items-center space-x-2 text-white ${
                              isReturned ? "text-stone-500" : ""
                            }`}
                          >
                            <FaBoxOpen className="text-gray-500" />
                            <Link
                              to={`/products/${item.productId._id}`}
                              className={`text-white ${isReturned ? "text-stone-500" : ""}`}
                            >
                              {item.productId.name}
                            </Link>
                            <span className="text-md text-green-700 font-bold">
                              {item.productId.price}€
                            </span>
                            <span className="font-bold">(x{item.quantity})</span>
                            {isReturned && (
                              <span className="text-red-500 font-bold ml-2">
                                Zurückgeschickt
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">Keine Bestellungen gefunden.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
