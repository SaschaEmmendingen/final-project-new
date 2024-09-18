import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Main/AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1312/api/auth/login", { email, password });
      console.log("Login Response:", response.data); // Logge die gesamte Antwort
  
      const { token, role, name, email: userEmail, address, phone } = response.data;
  
      console.log("Response Data:", response.data); // Zeigt die gesamte Antwort
      console.log("Token:", token); // Zeigt den Token
      console.log("Role:", role); // Zeigt die Rolle
      console.log("Name:", name); // Zeigt den Namen
      console.log("Email:", userEmail); // Zeigt die Email
      console.log("Address:", address); // Zeigt die Adresse
      console.log("Phone:", phone); // Zeigt die Telefonnummer
  
      // Speichern im localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userInfo", JSON.stringify({ name, email: userEmail, address, phone }));
      // localStorage.setItem("adminInfo", JSON.stringify({ name, email: userEmail, address, phone }));

      console.log("Stored Token:", localStorage.getItem("token"));
      console.log("Stored Role:", localStorage.getItem("role"));
      console.log("Stored User Info:", localStorage.getItem("userInfo"));
  
      await login(token, role);
      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError("Login fehlgeschlagen: " + (err.response?.data?.message || "Unbekannter Fehler"));
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-8 bg-stone-900 p-8 shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-400">Anmelden</h3>
      <form onSubmit={handleLogin}>
        <label className="block mb-2 text-gray-400">
          E-Mail Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-0 p-2 mb-4 rounded-lg text-gray-400 focus:outline-none focus:border-blue-500 bg-stone-600"
          placeholder="E-Mail Adresse"
          required
        />

        <label className="block mb-2 text-gray-400">
          Passwort <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-0 p-2 mb-4 rounded-lg text-gray-400 focus:outline-none focus:border-blue-500 bg-stone-600"
          placeholder="Passwort"
          required
        />

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
};

export default Login;
