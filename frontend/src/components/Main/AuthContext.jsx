import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo');
    const storedRole = localStorage.getItem('role');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user info from localStorage", error);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const endpoint = role === 'admin'
        ? 'http://localhost:1312/api/admins/login'
        : 'http://localhost:1312/api/auth/login';

      const response = await axios.post(endpoint, { email, password });
      const { token, name } = response.data;

      setToken(token);
      setUser({ name }); // Speichern Sie nur den Namen im User-Objekt
      setRole(role);

      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify({ name }));
      localStorage.setItem('role', role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Direktes Weiterleiten nach Logout
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};