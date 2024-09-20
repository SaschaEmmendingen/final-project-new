import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNotifications } from "../Main/NotificationContext";

const AdminNotifications = () => {
  const {
    notifications,
    fetchNotifications,
    handleClearNotifications,
    handleDeleteNotification,
  } = useNotifications();
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [recipientType, setRecipientType] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
    fetchAdmins();
  }, [fetchNotifications]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllUsers(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/admins", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllAdmins(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Admins:", error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleRecipientChange = (type) => {
    setRecipientType(type);
    setSelectedUsers([]);

    if (type === "ALL") {
      // Alle Benutzer und Admins auswählen
      const allSelected = [
        ...allUsers.map((user) => user._id),
        ...allAdmins.map((admin) => admin._id),
      ];
      setSelectedUsers(allSelected);
    }
  };

  const handleSendMessage = async () => {
    if (!message || selectedUsers.length === 0) {
      alert("Bitte fülle alle Felder aus und wähle mindestens einen Benutzer aus.");
      return;
    }

    console.log("Message:", message);
    console.log("Selected Users:", selectedUsers);

    try {
      const uniqueRecipients = [...new Set(selectedUsers)];

      await axios.post('http://localhost:1312/api/notify-admin/send', {
        message,
        recipients: uniqueRecipients
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert("Nachricht erfolgreich gesendet.");
      setMessage('');
      setSelectedUsers([]);
      fetchNotifications();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Benachrichtigungen</h2>
      {notifications.length === 0 ? (
        <p>Keine neuen Benachrichtigungen.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li
              key={`${notification._id}-${index}`}
              className="p-2 bg-stone-100 border border-stone-300 rounded-md"
            >
              <div className="flex justify-between items-center">
                <span>{notification.message}</span>
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="ml-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setShowSendMessage(!showSendMessage)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        {showSendMessage ? "Nachricht senden abbrechen" : "Nachricht senden"}
      </button>
      {showSendMessage && (
        <div className="mt-4">
          <textarea
            placeholder="Nachricht"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded p-2 mr-2 w-full"
          />
          <div className="mt-2">
            <label className="block mb-2">Empfänger auswählen:</label>
            <select
              onChange={(e) => handleRecipientChange(e.target.value)}
              className="border rounded p-2 mr-2"
            >
              <option value="">Bitte wählen...</option>
              <option value="ALL">Alle Benutzer und Admins</option>
              <option value="USER">Benutzer</option>
              <option value="ADMIN">Admins</option>
            </select>
            {recipientType === "USER" && (
              <div className="mt-2">
                {allUsers.map((user) => (
                  <div key={user._id}>
                    <input
                      type="checkbox"
                      id={user._id}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                    />
                    <label htmlFor={user._id} className="ml-2">
                      {user.name || user.email}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {recipientType === "ADMIN" && (
              <div className="mt-2">
                {allAdmins.map((admin) => (
                  <div key={admin._id}>
                    <input
                      type="checkbox"
                      id={admin._id}
                      checked={selectedUsers.includes(admin._id)}
                      onChange={() => handleUserSelect(admin._id)}
                    />
                    <label htmlFor={admin._id} className="ml-2">
                      {admin.name || admin.email}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Senden
          </button>
        </div>
      )}
      <button
        onClick={handleClearNotifications}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Alle Benachrichtigungen löschen
      </button>
    </div>
  );
};

export default AdminNotifications;
