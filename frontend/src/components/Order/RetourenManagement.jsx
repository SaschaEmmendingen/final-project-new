import React, { useState, useEffect } from "react";

const RetourenManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Hole den Token aus localStorage
        if (!token) {
          throw new Error("No token found");
        }
  
        const response = await fetch("http://localhost:1312/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`, // Token in den Headers setzen
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched orders data:", data); // Log der abgerufenen Bestellungen
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Fehler beim Abrufen der Bestellungen");
      }
    };
  
    fetchOrders();
  }, []);

  const extractReturns = (order) => {
    const returns = order.returns.flatMap((returnItem) => ({
      reason: returnItem.reason,
      returnedAt: returnItem.returnedAt,
      items: returnItem.items,
    }));
    console.log("Extracted returns:", returns); // Log der extrahierten Rücksendungen
    return returns;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 border-2 border-blue-500 rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Retourenmanagement</h1>
  
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Reason</th>
            <th className="px-4 py-2 border">Returned At</th>
            <th className="px-4 py-2 border">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const returns = extractReturns(order);
            console.log("Returns for order:", returns); // Log der Rücksendungen für jede Bestellung
            return returns.length > 0
              ? returns.map((returnItem, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{order._id}</td>
                    <td className="px-4 py-2 border">{returnItem.reason}</td>
                    <td className="px-4 py-2 border">
                      {new Date(returnItem.returnedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {returnItem.items.map((item) => (
                        <div key={item.productId._id}>
                          {item.quantity} x {item.name || 'Placeholder Name'}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              : null;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RetourenManagement;
