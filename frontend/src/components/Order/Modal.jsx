// Modal.js
import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center pt-48 items-center bg-gray-900 bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg"
        onClick={(e) => e.stopPropagation()} // Verhindert, dass der Klick im Modal das Schließen auslöst
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Product"
          className="max-w-[90vw] max-h-[70vh] object-contain" // Anpassen der Größe
          style={{ maxWidth: "1200px" }} // Setze hier eine angepasste maximale Breite des Bildes
        />
      </div>
    </div>
  );
};

export default Modal;
