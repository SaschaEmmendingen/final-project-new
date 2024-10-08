import React, { useState } from "react";
import { useAuth } from "../Main/AuthContext";
import axios from "axios";

const UserSupport = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Bitte logge dich ein, um Support zu kontaktieren.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1312/api/support",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Deine Anfrage wurde erfolgreich gesendet.");

        // Benachrichtigung an den Admin senden
        await axios.post(
          "http://localhost:1312/api/admin/notifications",
          {
            type: "support",
            message: `Eine neue Support-Anfrage wurde eingereicht mit dem Betreff: ${formData.subject}.`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        alert("Fehler beim Senden der Support-Anfrage. Bitte versuche es erneut.");
      }
    } catch (error) {
      alert("Es gab ein Problem beim Senden der Support-Anfrage. Bitte versuche es später erneut.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-3/5 mx-auto mt-8" >
      <form onSubmit={handleSubmit} className="mx-15 p-4 border-0 rounded-md" style={{ background: "linear-gradient(#78716c, #292524 10%)" }}>
        <div className="mb-4">
          <label htmlFor="subject" className="block font-medium text-gray-400">
            Betreff
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border-0 rounded-md bg-stone-600 outline-none text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block font-medium text-gray-400">
            Nachricht
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border-0 rounded-md bg-stone-600 outline-none text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-stone-600 text-white py-2 px-4 rounded-md w-full hover:bg-stone-700"
        >
          Anfrage senden
        </button>
      </form>
    </div>
  );
};

export default UserSupport;
