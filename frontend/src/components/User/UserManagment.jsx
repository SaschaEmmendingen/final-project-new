import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Funktion um Token aus dem Local Storage zu holen
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    axios.get('http://localhost:1312/api/users', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setAddress(user.address);
    setPhone(user.phone);
    setIsEditing(true);
  };

  const handleDelete = (userId) => {
    // Bestätigungsnachricht
    const confirmDelete = window.confirm("Willst du den User wirklich löschen?");
    if (confirmDelete) {
      axios.delete(`http://localhost:1312/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
        .then(() => {
          setUsers(users.filter(user => user._id !== userId));
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const handleSave = () => {
    axios.put(`http://localhost:1312/api/users/${selectedUser._id}`, { name, email, address, phone }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(response => {
        setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
        setIsEditing(false);
        setSelectedUser(null);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {isEditing ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Edit User</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">ID:</label>
              <input
                type="text"
                value={selectedUser?._id || ''}
                readOnly
                className="border border-pink-500 p-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-pink-500 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-pink-500 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-pink-500 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-pink-500 p-2 rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <table className="w-full border border-pink-500">
            <thead>
              <tr>
                <th className="border-b border-pink-500 p-2">ID</th>
                <th className="border-b border-pink-500 p-2">Name</th>
                <th className="border-b border-pink-500 p-2">Email</th>
                <th className="border-b border-pink-500 p-2">Address</th>
                <th className="border-b border-pink-500 p-2">Phone</th>
                <th className="border-b border-pink-500 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="border-b border-pink-500 p-2">{user._id}</td>
                  <td className="border-b border-pink-500 p-2">{user.name}</td>
                  <td className="border-b border-pink-500 p-2">{user.email}</td>
                  <td className="border-b border-pink-500 p-2">{user.address}</td>
                  <td className="border-b border-pink-500 p-2">{user.phone}</td>
                  <td className="border-b border-pink-500 p-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagment;