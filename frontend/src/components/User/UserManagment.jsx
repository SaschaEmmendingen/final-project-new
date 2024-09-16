import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Für Popup
  const [popupType, setPopupType] = useState(""); // Speichert den Popup-Typ: 'edit' oder 'delete'
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/users", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Fehler beim Laden der Benutzerdaten.");
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setAddress(user.address);
    setPhone(user.phone);
    setPopupType("edit");
    setIsPopupOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setPopupType("delete");
    setIsPopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:1312/api/users/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Fehler beim Löschen des Benutzers.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:1312/api/users/${selectedUser._id}`,
        { name, email, address, phone },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? response.data : user
        )
      );
      setIsEditing(false);
      setSelectedUser(null);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Fehler beim Aktualisieren des Benutzers.");
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      {isLoading ? (
        <div className="text-center">Laden...</div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Alle Benutzer</h2>
          <table className="w-full border border-pink-500">
            <thead>
              <tr>
                <th className="border-b border-pink-500 p-2">ID</th>
                <th className="border-b border-pink-500 p-2">Name</th>
                <th className="border-b border-pink-500 p-2">Email</th>
                <th className="border-b border-pink-500 p-2">Address</th>
                <th className="border-b border-pink-500 p-2">Phone</th>
                <th className="border-b border-pink-500 p-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border-b border-pink-500 p-2">{user._id}</td>
                  <td className="border-b border-pink-500 p-2">{user.name}</td>
                  <td className="border-b border-pink-500 p-2">{user.email}</td>
                  <td className="border-b border-pink-500 p-2">
                    {user.address}
                  </td>
                  <td className="border-b border-pink-500 p-2">{user.phone}</td>
                  <td className="border-b border-pink-500 p-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            {popupType === "edit" ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Benutzer bearbeiten
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-pink-500 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-pink-500 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Address:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border border-pink-500 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Phone:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border border-pink-500 p-2 rounded w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-yellow-500 text-white py-2 px-4 rounded mr-2"
                  >
                    Speichern
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Abbrechen
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Benutzer löschen</h2>
                <p>Bist du sicher, dass du den Benutzer löschen möchtest?</p>
                <div className="mt-4">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                  >
                    Löschen
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagment;
