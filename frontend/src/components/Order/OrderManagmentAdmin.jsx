import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBestellungen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Token aus dem lokalen Speicher holen
        const response = await axios.get('http://localhost:1312/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error.response ? error.response.data : error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token'); // Holen Sie sich das Token aus dem lokalen Speicher
      await axios.delete(`http://localhost:1312/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(orders.filter(order => order._id !== orderId)); // Bestellungen nach dem Löschen aktualisieren
    } catch (error) {
      console.error('Fehler beim Löschen der Bestellung:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Verwaltung der Bestellungen</h2>
      {orders.length === 0 ? (
        <p>Keine Bestellungen vorhanden.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-medium">Bestellung #{order._id}</h3>
              <p className="text-sm">Gesamtbetrag: {order.total} €</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} - {item.price}
                  </li>
                ))}
              </ul>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-red-600"
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