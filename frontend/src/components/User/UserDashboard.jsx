import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile'; // Deine UserProfile-Komponente
import OrderManagment from './OrderManagment';
import Button3Component from './Button3Component'; // Deine Button3-Komponente
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(''); // Zustand für die aktive Sektion
  const navigate = useNavigate(); // Initialisiere useNavigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:1312/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data.user);
      } catch (err) {
        setError('Fehler beim Laden des Dashboards.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'orders':
        return <OrderManagment />;
      case 'button3':
        return <Button3Component />;
      default:
        return <p>Bitte wählen Sie eine Option.</p>;
    }
  };

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Entferne das Token aus dem lokalen Speicher
    window.location.reload(); // Seiten-Refresh auslösen
    navigate('/login'); // Leite den Benutzer zur Anmeldeseite um
  };

  if (loading) {
    return <p>Lade...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Benutzer nicht gefunden.</p>;
  }

  return (
    <div className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg border border-blue-600">
      <h3 className="text-xl font-bold mb-4">Willkommen, {user.name}!</h3>
      
      {/* Buttons */}
      <button 
        className='bg-violet-600 border text-white p-2 mb-2 border-pink-400 rounded' 
        onClick={() => handleButtonClick('profile')}
      >
        Profil
      </button>
      <br />
      <button 
        className='bg-violet-600 border text-white p-2 mb-2 border-pink-400 rounded'
        onClick={() => handleButtonClick('orders')}
      >
        Bestellungen
      </button>
      <br />
      <button 
        className='bg-violet-600 border text-white p-2 mb-2 border-pink-400 rounded'
        onClick={() => handleButtonClick('button3')}
      >
        Button 3
      </button>
      <br />
      <button 
        className='bg-red-600 border text-white p-2 mb-2 border-pink-400 rounded'
        onClick={handleLogout} // Logout-Funktion aufrufen
      >
        Logout
      </button>
      
      {/* Sektion anzeigen */}
      <div className="mt-4 p-4 border-t border-gray-200">
        {renderSection()}
      </div>
    </div>
  );
};

export default UserDashboard;