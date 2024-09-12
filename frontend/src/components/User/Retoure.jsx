import React, { useState, useEffect } from "react";

const Retoure = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [returnItems, setReturnItems] = useState({}); // Speichert die ausgewählten Artikel für die Rücksendung

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:1312/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Stelle sicher, dass der Token gesetzt ist
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        alert(error.message);
      }
    };
    fetchOrders();
  }, []);

  // Funktion zum Handhaben der Checkboxen
  const handleItemSelection = (itemId) => {
    setReturnItems((prevItems) => ({
      ...prevItems,
      [itemId]: !prevItems[itemId], // Toggle Auswahl
    }));
  };

  const handleReturn = async () => {
    const selectedItems = Object.keys(returnItems).filter(
      (itemId) => returnItems[itemId]
    );

    console.log("Selected Items for Return:", selectedItems); // Log ausgewählte Artikel

    if (selectedItems.length === 0) {
      alert("Please select at least one item for return.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Hole den Token aus localStorage

      if (!token) {
        alert("You are not authenticated. Please log in again.");
        return;
      }

      console.log("Token:", token); // Log den Token
      console.log("Selected Order:", selectedOrder); // Log die ausgewählte Bestellung
      console.log("Return Reason:", reason); // Log den Rücksendegrund

      const response = await fetch(
        `http://localhost:1312/api/orders/${selectedOrder}/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token in den Headers setzen
          },
          body: JSON.stringify({ reason, items: selectedItems }),
        }
      );

      console.log("Response Status:", response.status); // Log den Status der Antwort

      if (response.ok) {
        alert("Return processed successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to process return:", errorData);
        alert(
          `Failed to process return: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error processing return:", error);
      alert("Error processing return");
    }
  };

  const isItemReturned = (order, itemId) => {
    return order.returns.some((returnItem) =>
      returnItem.items.some(
        (returnedItem) => returnedItem.productId.toString() === itemId
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-8 text-center">Returns</h1>
      <div className="max-w-lg mx-auto p-4 border-2 border-pink-500 rounded-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Order:
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-pink-500 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order._id} - {order.createdAt}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedOrder && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Select items to return:
            </h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Select</th>
                  <th className="px-4 py-2 border">Item Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .find((order) => order._id === selectedOrder)
                  ?.items.map((item) => (
                    <tr key={item.productId._id}>
                      <td className="px-4 py-2 border text-center">
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
                        />
                      </td>
                      <td
                        className={`px-4 py-2 border ${
                          isItemReturned(
                            orders.find((order) => order._id === selectedOrder),
                            item.productId._id
                          )
                            ? "text-gray-500"
                            : ""
                        }`}
                      >
                        {item.productId.name}{" "}
                        {isItemReturned(
                          orders.find((order) => order._id === selectedOrder),
                          item.productId._id
                        ) && "(Zurückgeschickt)"}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Reason for Return:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-pink-500 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
          </label>
        </div>

        <button
          onClick={handleReturn}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit Return
        </button>
      </div>
    </div>
  );
};

export default Retoure;
