import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import { useAuth } from './AuthContext';  // Assuming you have an AuthContext for user authentication
import { useAuth } from '../Main/AuthContext';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:1312/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <h1 className="text-3xl font-bold my-8 text-center">My Orders</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
              >
                <h3 className="text-lg font-semibold">
                  Order #{order._id}
                </h3>
                <p className="text-md text-gray-700">Total: {order.total} €</p>
                <p className="text-md text-gray-700">Status: {order.status}</p>
                <ul className="mt-4">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <FaBoxOpen className="text-gray-500" />
                      <span>{item.productId.name} (x{item.quantity})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;