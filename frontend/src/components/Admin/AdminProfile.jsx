import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:1312/api/admins/profile",
        { ...profile, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setMessage("Profil erfolgreich aktualisiert");
        setIsError(false);
        setIsEditing(false); // Bearbeitungsmodus deaktivieren
      } else {
        throw new Error("Unbekannter Fehler beim Aktualisieren");
      }
    } catch (error) {
      setMessage("Fehler beim Aktualisieren des Profils");
      setIsError(true);
    }
  };

  if (loading) {
    return <div>Lädt...</div>;
  }

  if (error) {
    return <div>Fehler: {error}</div>;
  }

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto pt-5 pb-12">
      {message && (
        <p className={`mb-4 ${isError ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}

      {!isEditing ? (
        <div
          className="mb-4 pt-8 pl-8 space-y-4 bg-stone-800 rounded-lg shadow-lg"
          style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
        >
          <h2
            className="text-gray-400"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
          >
            Admin Profil
          </h2>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm font-semibold w-1/3">Name:</p>
            <p className="text-gray-300 text-base">{profile.name}</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm font-semibold w-1/3">Email:</p>
            <p className="text-gray-300 text-base">{profile.email}</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm font-semibold w-1/3">Adresse:</p>
            <p className="text-gray-300 text-base">{profile.address}</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm font-semibold w-1/3">Telefon:</p>
            <p className="text-gray-300 text-base">{profile.phone}</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm font-semibold w-1/3">Rolle:</p>
            <p className="text-gray-300 text-base">{role}</p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 mr-4 mb-4"
            >
              Profil bearbeiten
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col pt-16 p-6 pb-4 bg-stone-800 rounded-lg shadow-lg"
          style={{ background: "linear-gradient(#78716c, #292524 10%)" }}
        >
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-2/3 p-2 border border-stone-600 rounded-md bg-stone-700 text-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-2/3 p-2 border border-stone-600 rounded-md bg-stone-700 text-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-300">Adresse</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-2/3 p-2 border border-stone-600 rounded-md bg-stone-700 text-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-300">Telefon</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-2/3 p-2 border border-stone-600 rounded-md bg-stone-700 text-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-300">Neues Passwort (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 p-2 border border-stone-600 rounded-md bg-stone-700 text-gray-300"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-stone-600 text-white text-xs p-2 rounded hover:bg-stone-700 mt-7"
            >
              Änderungen speichern
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-stone-600 text-white text-xs p-2 rounded hover:bg-stone-700 ml-2 mt-7"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProfile;
