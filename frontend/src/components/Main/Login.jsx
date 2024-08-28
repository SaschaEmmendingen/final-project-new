import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password, loginType);
      navigate(loginType === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (err) {
      setError('Login fehlgeschlagen: ' + err.message);
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4">Anmelden</h3>
      <form onSubmit={handleLogin}>
        <label className="block mb-2">
          Login-Typ <span className="text-red-500">*</span>
        </label>
        <select
          value={loginType}
          onChange={(e) => setLoginType(e.target.value)}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        
        <label className="block mb-2">
          E-Mail Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="E-Mail Adresse"
          required
        />
        
        <label className="block mb-2">
          Passwort <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Passwort"
          required
        />
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
};

export default Login;