import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationsUser = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:1312/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Benachrichtigungen:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Meine Benachrichtigungen</h2>
      {notifications.length === 0 ? (
        <p>Keine neuen Benachrichtigungen.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification._id} className="p-2 bg-stone-100 border border-stone-300 rounded-md">
              <div className="flex justify-between items-center">
                <span>{notification.message}</span>
                <span>{new Date(notification.date).toLocaleString('de-DE')}</span> {/* Datum und Uhrzeit */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsUser;
