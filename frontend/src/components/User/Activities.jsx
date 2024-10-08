import React, { useEffect, useState } from "react";
import axios from "axios";

const UserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token"); // Beispiel für Token aus localStorage
        const response = await axios.get(
          "http://localhost:1312/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Antwortdaten:", response.data); // Debugging
        setActivities(response.data.data.activities);
      } catch (err) {
        console.error(
          "Fehler beim Abrufen der Aktivitäten:",
          err.response ? err.response.data : err.message
        ); // Verbessertes Fehler-Logging
        setError("Fehler beim Abrufen der Aktivitäten");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <p>Laden...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="mx-15 p-4 border-0 rounded-md"
      style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
    >
      <ul className="text-gray-400">
        {activities.map((activity, index) => (
          <li key={index}>
            <strong>{activity.type}</strong>: {activity.description} -{" "}
            {new Date(activity.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivities;
