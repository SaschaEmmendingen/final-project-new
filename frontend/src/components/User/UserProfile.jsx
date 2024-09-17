import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:1312/api/users/profile",
        { name, email, address, phone, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response:", response);

      if (response.status >= 200 && response.status < 300) {
        setMessage("Profil erfolgreich aktualisiert");
        setIsError(false);
        setIsEditing(false); // Bearbeitungsmodus deaktivieren
      } else {
        throw new Error("Unbekannter Fehler beim Aktualisieren");
      }
    } catch (error) {
      console.error(
        "Fehlerdetails:",
        error.response ? error.response.data : error.message
      );
      setMessage("Fehler beim Aktualisieren des Profils");
      setIsError(true);
    }
  };

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAddress(user?.address || "");
    setPhone(user?.phone || "");
  }, [user]);

  return (
    <div
      className="mx-20 w-full p-8 border border-gray-400 rounded-md relative"
      style={{ 
        background: "linear-gradient(to top, gray, white 10%)",
        height:"40vh"
      }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center">Profil</h1>

      {message && (
        <p className={`mb-4 ${isError ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}

      {!isEditing ? (
        <div className="mb-4 pl-4">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Adresse:</strong> {address}
          </p>
          <p>
            <strong>Telefon:</strong> {phone}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-pink-500 text-white text-xs p-2 mt-4 rounded absolute bottom-4 right-4"
          >
            Profil bearbeiten
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex flex-col h-full">
          <div className="mb-4 pl-4">
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-2/3 p-2 border border-stone-800 rounded-md"
            />
          </div>
          <div className="mb-4 pl-4">
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-2/3 p-2 border border-stone-800 rounded-md"
            />
          </div>
          <div className="mb-4 pl-4">
            <label className="block mb-1 text-sm">Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-2/3 p-2 border border-stone-800 rounded-md"
            />
          </div>
          <div className="mb-4 pl-4">
            <label className="block mb-1 text-sm">Telefon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-2/3 p-2 border border-stone-800 rounded-md"
            />
          </div>
          <div className="mb-4 pl-4">
            <label className="block mb-1 text-sm">Neues Passwort (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 p-2 border border-stone-800 rounded-md"
            />
          </div>
          <div className="mt-auto pl-4 flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-pink-500 text-white text-xs p-2 rounded"
            >
              Änderungen speichern
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white text-xs p-2 rounded"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
