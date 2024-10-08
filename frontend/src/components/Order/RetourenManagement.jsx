import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RetourenManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("http://localhost:1312/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched orders data:", data);
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
    console.log("Extracted returns:", returns);
    return returns;
  };

  const handleEditClick = (productId) => {
    console.log("Navigating to product detail with ID:", productId);
    navigate(`/products/${productId}`);
  };

  return (
    <div className="mx-15 p-4">
      <h1
        className="text-2xl font-bold mb-4 text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Retourenmanagement
      </h1>
      <div
        className="border-0 rounded-md p-6"
        style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
      >
        <table className="min-w-full bg-stone-800 text-gray-400 rounded-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Returned At</th>
              <th className="px-4 py-2 border">Reason</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const returns = extractReturns(order);
              console.log("Returns for order:", returns);
              return returns.length > 0
                ? returns.map((returnItem, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{order._id}</td>
                      <td className="px-4 py-2 border">
                        {returnItem.items.map((item) => {
                          console.log(
                            "Product ID from return item:",
                            item.productId._id
                          ); // Überprüfe die ID
                          return (
                            <div
                              key={item.productId._id}
                              onClick={() =>
                                handleEditClick(item.productId._id)
                              }
                              className="cursor-pointer hover:underline text-blue-500"
                            >
                              {item.quantity} x {item.name || "Placeholder Name"}
                            </div>
                          );
                        })}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(returnItem.returnedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{returnItem.reason}</td>
                    </tr>
                  ))
                : null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetourenManagement;
