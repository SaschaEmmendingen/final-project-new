import React, { useState, useEffect } from "react";
import { useAuth } from "../Main/AuthContext";
import axios from "axios"; // Importiere Axios für HTTP-Anfragen

const Retoure = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [returnItems, setReturnItems] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          "http://localhost:1312/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        alert(error.message);
      }
    };

    fetchOrders();
  }, [token]);

  const handleItemSelection = (itemId) => {
    setReturnItems((prevItems) => ({
      ...prevItems,
      [itemId]: !prevItems[itemId],
    }));
  };

  const handleReturn = async () => {
    const selectedItems = Object.keys(returnItems).filter(
      (itemId) => returnItems[itemId]
    );

    if (selectedItems.length === 0) {
      alert("Bitte wähle mindestens einen Artikel zur Rücksendung aus.");
      return;
    }

    if (!reason.trim()) {
      alert("Bitte gib einen Grund für die Rücksendung an.");
      return;
    }

    try {
      if (!token) {
        alert("Du bist nicht authentifiziert. Bitte logge dich erneut ein.");
        return;
      }

      const response = await fetch(
        `http://localhost:1312/api/orders/${selectedOrder}/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason, items: selectedItems }),
        }
      );

      if (response.ok) {
        alert("Rücksendung erfolgreich bearbeitet.");

        // Sende Benachrichtigung an Admin
        try {
          const notificationResponse = await axios.post(
            "http://localhost:1312/api/notify-admin/notifications",
            {
              type: "return",
              message: `Eine Rücksendung wurde erstellt. Bestell-ID: ${selectedOrder}.`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Benachrichtigung gesendet:", notificationResponse.data);
        } catch (notificationError) {
          console.error(
            "Fehler beim Senden der Benachrichtigung:",
            notificationError.message
          );
          alert("Fehler beim Senden der Benachrichtigung.");
        }

        // Aktualisiere die Bestellungen nach der Rücksendung
        const updatedOrders = orders.map((order) => {
          if (order._id === selectedOrder) {
            return {
              ...order,
              returns: [
                ...order.returns,
                {
                  reason,
                  items: selectedItems.map((itemId) => {
                    const item = order.items.find(
                      (i) => i.productId._id === itemId
                    );
                    return {
                      productId: item.productId,
                      name: item.productId.name,
                      quantity: item.quantity,
                    };
                  }),
                },
              ],
            };
          }
          return order;
        });

        setOrders(updatedOrders);
        setSelectedOrder("");
        setReason("");
        setReturnItems({});
      } else {
        const errorData = await response.json();
        console.error("Fehler bei der Bearbeitung der Rücksendung:", errorData);
        alert(
          `Fehler bei der Bearbeitung der Rücksendung: ${errorData.message || "Unbekannter Fehler"}`
        );
      }
    } catch (error) {
      console.error("Fehler bei der Bearbeitung der Rücksendung:", error);
      alert("Fehler bei der Bearbeitung der Rücksendung.");
    }
  };

  const isItemReturned = (order, itemId) => {
    return order.returns.some((returnItem) =>
      returnItem.items.some(
        (returnedItem) => returnedItem.productId.toString() === itemId
      )
    );
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center pt-4">
        <div className="w-3/5 mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          Du musst eingeloggt sein, um Retouren zu verwalten. Bitte{" "}
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
      <div
        className="mx-15 p-4 border-0 rounded-md"
        style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
      >
        <h1 className="text-3xl font-bold my-8 text-white text-center">
          Retouren
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Bestellungen:
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-stone-500 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm bg-stone-600 text-white"
            >
              <option value="">Wähle eine Bestellung:</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order._id} - {new Date(order.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedOrder && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Wähle ein Artikel:</h2>
            <table className="min-w-full bg-stone-800 border border-stone-600">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-stone-600 text-white"></th>
                  <th className="px-4 py-2 border border-stone-600 text-white">Artikel</th>
                  <th className="px-4 py-2 border border-stone-600 text-white">Anzahl</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .find((order) => order._id === selectedOrder)
                  ?.items.map((item) => (
                    <tr key={item.productId._id}>
                      <td className="px-4 py-2 border border-stone-600 text-center">
                        <input
                          type="checkbox"
                          checked={returnItems[item.productId._id] || false}
                          onChange={() =>
                            handleItemSelection(item.productId._id)
                          }
                          disabled={isItemReturned(
                            orders.find((order) => order._id === selectedOrder),
                            item.productId._id
                          )}
                          className="form-checkbox"
                        />
                      </td>
                      <td
                        className={`px-4 py-2 border border-stone-600 ${
                          isItemReturned(
                            orders.find((order) => order._id === selectedOrder),
                            item.productId._id
                          )
                            ? "text-stone-500"
                            : "text-white"
                        }`}
                      >
                        {item.productId.name}{" "}
                        {isItemReturned(
                          orders.find((order) => order._id === selectedOrder),
                          item.productId._id
                        ) && "(Zurückgeschickt)"}
                      </td>
                      <td className="px-4 py-2 border border-stone-600 text-center text-white">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Grund:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-stone-500 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm bg-stone-600 text-white"
              placeholder="Gib hier deinen Rücksendegrund ein..."
            />
          </label>
        </div>

        <button
          onClick={handleReturn}
          className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-4 pr-4 mr-4 mt-4 transition duration-300"
        >
          Senden
        </button>
      </div>
    </div>
  );
};

export default Retoure;
