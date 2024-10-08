import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationsUser = () => {
  const [notifications, setNotifications] = useState([]);
  const [replyMessages, setReplyMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  console.log("Aktueller Benutzer:", currentUser);

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
      alert("Fehler beim Laden der Benachrichtigungen. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleReply = async (notificationId, recipientId) => {
    console.log("Benachrichtigungs-ID:", notificationId);
    if (!replyMessages[notificationId]) {
      alert("Bitte gib eine Antwort ein.");
      return;
    }

    const replyMessage = `${currentUser.name}: ${replyMessages[notificationId]}`;
    console.log("Antwortnachricht:", replyMessage);

    try {
      const response = await axios.put(
        "http://localhost:1312/api/notify-admin/notifications/replies",
        {
          notificationId,
          replyMessage,
          recipientId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Antwort vom Server:", response.data);
      alert("Antwort erfolgreich gesendet.");
      setReplyMessages((prev) => ({ ...prev, [notificationId]: "" }));
      fetchNotifications();
    } catch (error) {
      console.error("Fehler beim Senden der Antwort:", error);
      alert("Fehler beim Senden der Antwort: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div
        className="bg-white p-4 shadow-md rounded-lg max-h-96 overflow-y-auto"
        style={{ background: "linear-gradient(#78716C, #292524 10%)" }}
      >
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>Keine neuen Benachrichtigungen.</p>
        ) : (
          notifications.map((notification) => {
            console.log("Benachrichtigung:", notification); // Log der gesamten Benachrichtigung
            const recipientId =
              Array.isArray(notification.recipients) && notification.recipients.length > 0
                ? notification.recipients[0] // Nur die ID des Empfängers verwenden
                : null;

            return (
              <div key={notification.id} className="mb-4">
                <div className="mb-2">
                  <strong className="text-gray-400">
                    {notification.sender || "Admin"}
                  </strong>
                </div>
                {Array.isArray(notification.messages) && notification.messages.length > 0 ? (
                  notification.messages.map((msg) => {
                    return (
                      <div
                        key={msg._id}
                        className={`p-2 rounded-md mb-2 ${
                          msg.sender === currentUser._id
                            ? "bg-blue-100 self-end"
                            : "bg-gray-200 self-start"
                        }`}
                      >
                        <strong className="mr-5">
                          {/* {msg.sender === currentUser._id ? "Du" : "Admin"} */}
                        </strong>{" "}
                        {msg.message}
                      </div>
                    );
                  })
                ) : (
                  <div className="ml-4 mb-2">Keine Nachrichten vorhanden.</div>
                )}
                <textarea
                  className="w-full border-0 bg-stone-600 border-gray-300 text-white p-2 rounded mt-2 focus:outline-none"
                  value={replyMessages[notification.id] || ""}
                  onChange={(e) =>
                    setReplyMessages((prev) => ({
                      ...prev,
                      [notification.id]: e.target.value,
                    }))
                  }
                  placeholder="Antwort eingeben..."
                />
                <button
                  className="bg-stone-600 text-white px-4 py-2 rounded mt-2 hover:bg-stone-700"
                  onClick={() => {
                    console.log("Antwort-Button geklickt für Benachrichtigung:", notification.id);
                    handleReply(notification.id, recipientId);
                  }}
                >
                  Antworten
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsUser;
