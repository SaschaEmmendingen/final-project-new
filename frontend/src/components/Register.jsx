import React, { useState } from 'react';
import axios from 'axios'; // Stelle sicher, dass axios installiert ist

const Registrierung = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1312/api/auth/register', formData); // Stelle sicher, dass der Endpunkt korrekt ist
      console.log('Server Antwort:', response.data);
      setSuccess('Registrierung erfolgreich!');
      setError('');
  
      // Formular zurücksetzen
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
      });
    } catch (err) {
      if (err.response) {
        console.error('Server antwortete mit Fehler:', err.response.data);
        setError('Fehler bei der Registrierung: ' + (err.response.data.message || 'Unbekannter Fehler'));
      } else if (err.request) {
        console.error('Keine Antwort vom Server erhalten:', err.request);
        setError('Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.');
      } else {
        console.error('Fehler:', err.message);
        setError('Fehler: ' + err.message);
      }
      setSuccess('');
    }
  };

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4">Registrieren</h3>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Name"
          required
        />

        <label className="block mb-2">
          E-Mail Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="E-Mail Adresse"
          required
        />

        <label className="block mb-2">
          Passwort <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Passwort"
          required
        />

        <label className="block mb-2">
          Adresse
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Adresse"
        />

        <label className="block mb-2">
          Telefonnummer
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Telefonnummer"
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Registrieren
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default Registrierung;