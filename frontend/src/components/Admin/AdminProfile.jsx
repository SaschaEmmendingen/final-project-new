import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "Unbekannt");
    console.log("Stored Role:", storedRole);
  }, []);

  useEffect(() => {
    const fetchProfile = () => {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log("Fetched User Info:", adminInfo);

      if (adminInfo) {
        setProfile(adminInfo);
        setLoading(false);
      } else {
        setError("Admin nicht gefunden");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Lädt...</div>;
  }

  if (error) {
    return <div>Fehler: {error}</div>;
  }

  if (!profile) {
    return <div>Kein Profil gefunden</div>;
  }

  return (
    <div>
      <h2
        className="text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Admin Profil
      </h2>
      <p className="text-gray-400">
        <strong>Name:</strong> {profile.name}
      </p>
      <p className="text-gray-400">
        <strong>Email:</strong> {profile.email}
      </p>
      <p className="text-gray-400">
        <strong>Adresse:</strong> {profile.address}
      </p>
      <p className="text-gray-400">
        <strong>Telefon:</strong> {profile.phone}
      </p>
      <p className="text-gray-400 mb-4">
        <strong>Rolle:</strong> {role}
      </p>
    </div>
  );
};

export default AdminProfile;
