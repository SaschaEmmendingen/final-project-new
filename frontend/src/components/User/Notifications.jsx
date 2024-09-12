import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`http://localhost:1312/api/notifications/user/${userId}`);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [userId]);

  return (
    <div>
      <h2>Benachrichtigungen</h2>
      <ul>
        {notifications.map(({ _id, message }) => (
          <li key={_id}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;