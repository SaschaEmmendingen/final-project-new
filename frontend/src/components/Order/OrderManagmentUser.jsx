import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaTrashAlt } from 'react-icons/fa';
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
        
        console.log("Fetched Orders with Returns:", data); // <-- Prüfe hier die Daten
        
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:1312/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove the deleted order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const formatOrderId = (id) => `Order #${id}`;

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <h1 className="text-3xl font-bold my-8 text-center">My Orders</h1>
  
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-red-500 rounded-lg shadow-md p-4"
              >
                <h3 className="text-lg font-semibold">
                  {formatOrderId(order._id)}
                </h3>
                <p className="text-md text-green-700 font-bold">Total: {order.total} €</p>
                <ul className="mt-4">
                  {order.items.map((item) => {
                    // Prüfen, ob das Item in den Rücksendungen enthalten ist
                    const isReturned = order.returns.some(returnItem =>
                      returnItem.items.some(returnedItem =>
                        returnedItem.productId.toString() === item.productId._id
                      )
                    );

                    console.log("Item:", item.productId.name, "Returned:", isReturned); // <-- Console Log hier

                    return (
                      <li
                        key={item.productId._id}
                        className={`flex items-center space-x-2 ${isReturned ? 'text-gray-400' : ''}`}
                      >
                        <FaBoxOpen className="text-gray-500" />
                        <span>{item.productId.name} </span>
                        <span className="text-md text-green-700 font-bold">{item.productId.price}€</span>
                        <span className="font-bold">(x{item.quantity})</span>
                        {isReturned && (
                          <span className="text-red-500 font-bold ml-2">Zurückgeschickt</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded mt-2 flex items-center space-x-2"
                >
                  <FaTrashAlt className="mr-2" />
                  Delete Order
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;