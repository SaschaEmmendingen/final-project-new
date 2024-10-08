import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [dropdownOpenUsers, setDropdownOpenUsers] = useState(false);
  const [dropdownOpenAdmins, setDropdownOpenAdmins] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const usersDropdownRef = useRef(null);
  const adminsDropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchUsersAndAdmins();

    const handleClickOutside = (event) => {
      if (
        usersDropdownRef.current &&
        !usersDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpenUsers(false);
      }
      if (
        adminsDropdownRef.current &&
        !adminsDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpenAdmins(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1312/api/notify-admin/notifications",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Abgerufene Benachrichtigungen:", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Benachrichtigungen:", error);
    }
  };

  const fetchUsersAndAdmins = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:1312/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const adminsResponse = await axios.get(
        "http://localhost:1312/api/admins",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAllUsers(usersResponse.data);
      setAllAdmins(adminsResponse.data);
    } catch (error) {
      console.error(
        "Fehler beim Laden der Benutzer und Administratoren:",
        error
      );
    }
  };

  const handleSendMessage = async () => {
    if (
      !message ||
      (selectedUsers.length === 0 && selectedAdmins.length === 0)
    ) {
      alert(
        "Bitte fülle alle Felder aus und wähle mindestens einen Benutzer oder Administrator aus."
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:1312/api/notify-admin/notifications",
        {
          message,
          recipients: [
            ...selectedUsers.map((userId) => userId),
            ...selectedAdmins.map((adminId) => `admin_${adminId}`),
          ],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Nachricht erfolgreich gesendet.");
      setMessage("");
      setSelectedUsers([]);
      setSelectedAdmins([]);
      fetchNotifications();
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
      alert(
        "Fehler beim Senden der Nachricht: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReply = async (notificationId) => {
    if (!replyMessages[notificationId]) {
      alert("Bitte gib eine Antwort ein.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:1312/api/notify-admin/notifications/replies",
        { notificationId, replyMessage: replyMessages[notificationId] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Antwort erfolgreich gesendet.");
      setReplyMessages((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Fehler beim Senden der Antwort:", error);
      alert(
        "Fehler beim Senden der Antwort: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReplyChange = (notificationId, value) => {
    setReplyMessages((prev) => ({
      ...prev,
      [notificationId]: value,
    }));
  };

  const handleDelete = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Möchten Sie diese Benachrichtigung wirklich löschen?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:1312/api/notify-admin/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Benachrichtigung erfolgreich gelöscht.");
      fetchNotifications(); // Benachrichtigungen neu abrufen
    } catch (error) {
      console.error("Fehler beim Löschen der Benachrichtigung:", error);
      alert(
        "Fehler beim Löschen der Benachrichtigung: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-2xl font-bold mb-4 text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Nachrichten
      </h1>
      <div className="bg-white text-gray-400 p-4 shadow-md rounded-lg mb-6" style={{ background: "linear-gradient(#78716c, #292524 10%)" }}>
        <h3 className="text-xl font-semibold mb-2">Neue Nachricht senden</h3>
        <textarea
          className="w-full border-0 bg-stone-600 text-white border-gray-300 p-2 rounded outline-none mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht eingeben..."
        />
        <div className="flex space-x-4 mb-4">
          <div ref={usersDropdownRef} className="relative">
            <button
              className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-3 pr-4 transition duration-300"
              onClick={() => setDropdownOpenUsers(!dropdownOpenUsers)}
            >
              Benutzer auswählen
            </button>
            {dropdownOpenUsers && (
              <div className="absolute z-10 bg-stone-800 border border-gray-300 rounded shadow-md mt-1">
                {allUsers.map((user) => (
                  <div key={user._id} className="flex items-center p-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => {
                        setSelectedUsers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        );
                      }}
                    />
                    <span className="ml-2">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={adminsDropdownRef} className="relative">
            <button
              className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-3 pr-4 transition duration-300"
              onClick={() => setDropdownOpenAdmins(!dropdownOpenAdmins)}
            >
              Administrator auswählen
            </button>
            {dropdownOpenAdmins && (
              <div className="absolute z-10 bg-stone-800 border border-gray-300 rounded shadow-md mt-1">
                {allAdmins.map((admin) => (
                  <div key={admin._id} className="flex items-center p-2">
                    <input
                      type="checkbox"
                      checked={selectedAdmins.includes(admin._id)}
                      onChange={() => {
                        setSelectedAdmins((prev) =>
                          prev.includes(admin._id)
                            ? prev.filter((id) => id !== admin._id)
                            : [...prev, admin._id]
                        );
                      }}
                    />
                    <span className="ml-2">{admin.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-3 pr-4 transition duration-300"
          onClick={handleSendMessage}
        >
          Nachricht senden
        </button>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg text-gray-400" style={{ background: "linear-gradient(#78716c, #292524 10%)" }}>
      <h1
        className="text-2xl font-bold mb-4 text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Benachrichtigungen
      </h1>
        {notifications.map((notification) => (
          <div key={notification._id} className="border-0 rounded-md text-white border-stone-600 mb-4 p-2 pt-6 bg-stone-800">
            {/* <div className="mb-2">
              <strong>Sender:</strong> {notification.senderName}
            </div> */}
            <div className="mb-2">
              <strong>Nachrichten:</strong>
            </div>
            {Array.isArray(notification.messages) &&
            notification.messages.length > 0 ? (
              notification.messages.map((msg, index) => (
                <div key={index} className="ml-4 mb-2 border rounded-md p-2" style={{ background: "linear-gradient(#292524,#78716c  30%)" }}>
                  {msg.message}
                </div>
              ))
            ) : (
              <div className="ml-4 mb-2">Keine Nachrichten vorhanden.</div>
            )}
            <textarea
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              value={replyMessages[notification._id] || ""}
              onChange={(e) =>
                handleReplyChange(notification._id, e.target.value)
              }
              placeholder="Antwort eingeben..."
            />
            <button
              className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-4 pr-4 mr-4 mt-4 transition duration-300"
              onClick={() => handleReply(notification._id)}
            >
              Antworten
            </button>
            <button
              className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-4 pr-4 mr-4 mt-4 transition duration-300"
              onClick={() => handleDelete(notification._id)} // Lösch-Button
            >
              Löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
