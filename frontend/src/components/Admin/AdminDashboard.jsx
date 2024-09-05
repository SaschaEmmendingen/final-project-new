import React, { useEffect, useState } from 'react';
import ProductManagement from '../Order/ProductManagment';
import AdminProfile from './AdminProfile';
import UserManagment from '../User/UserManagment';
import OrderManagment from '../Order/OrderManagmentAdmin';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Rolle und Benutzerinformationen aus localStorage holen
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('userInfo');

    console.log('Stored Role on Dashboard Load:', storedRole); // Debugging-Ausgabe
    console.log('Stored User Info on Dashboard Load:', storedUser); // Debugging-Ausgabe

    setRole(storedRole || 'Unbekannt');
    setUser(storedUser ? JSON.parse(storedUser) : null);

    // Weiterleitung bei fehlender Admin-Rolle
    if (storedRole !== 'admin') {
      navigate('/login'); // Weiterleitung zu einer anderen Seite
    }
  }, [navigate]);

  const renderView = () => {
    switch (activeView) {
      case 'product':
        return <ProductManagement />;
      case 'profile':
        return <AdminProfile />;
      case 'user':
        return <UserManagment />;
      case 'orders':
        return <OrderManagment />;
      default:
        return <div>Willkommen im Admin Dashboard</div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg border border-blue-400">
      <h3 className="text-xl font-bold mb-4">Admin Dashboard</h3>
      <p className="mb-4 text-green-600">
        <strong>Eingeloggt:</strong> {user?.name || 'Unbekannt'}
      </p>
      <button
        onClick={() => setActiveView('profile')}
        className="bg-pink-400 text-white py-2 px-4 rounded my-1"
      >
        Profil
      </button>
      <br />
      <button
        onClick={() => setActiveView('user')}
        className="bg-blue-500 text-white py-2 px-4 rounded my-1"
      >
        User Verwaltung
      </button>
      <br />
      <button
        onClick={() => setActiveView('product')}
        className="bg-yellow-600 text-white py-2 px-4 rounded my-1"
      >
        Produkt Verwaltung
      </button>
      <br />
      <button
        onClick={() => setActiveView('orders')}
        className="bg-green-600 text-white py-2 px-4 rounded my-1"
      >
        Bestellungen
      </button>
      <br />
      <button
        className="bg-red-600 border text-white p-2 mb-2 border-pink-400 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="mt-8">{renderView()}</div>
    </div>
  );
};

export default AdminDashboard;