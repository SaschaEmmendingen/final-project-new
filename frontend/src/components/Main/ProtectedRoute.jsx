import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Main/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();

  // Wenn kein Token vorhanden ist, leite zum Login weiter
  if (!token) {
    return <Navigate to="/konto" />;
  }

  // Wenn Token vorhanden ist, rendere das übergebene Element
  return element;
};

export default ProtectedRoute;
