import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBestellungen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:1312/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (index) => {
    // Hier könnte eine Logik zum Löschen von Bestellungen hinzugefügt werden
    // Zum Beispiel: axios.delete(`/api/orders/${index}`);
  };

  return (
    <div className="w-4/5 mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Verwaltung der Bestellungen</h2>
      {orders.length === 0 ? (
        <p>Keine Bestellungen vorhanden.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-medium">Bestellung #{index + 1}</h3>
              <p className="text-sm">Gesamtbetrag: {order.total} €</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} - {item.price}
                  </li>
                ))}
              </ul>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-red-600"
                onClick={() => handleDeleteOrder(index)}
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