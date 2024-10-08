import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useAuth } from "./Main/AuthContext";
import { useNavigate } from "react-router-dom";

// Modal für Erfolgsmeldung
const SuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Bestellung erfolgreich!</h2>
        <p className="text-gray-700 mb-4">
          Deine Bestellung wurde erfolgreich abgeschickt.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Warenkorb = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal-Steuerung

  const totalAmount = cartItems
    .reduce((total, item) => {
      const priceNumber =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("€", "").replace(",", "."))
          : item.price;

      return (
        total + (isNaN(priceNumber) ? 0 : priceNumber * (item.quantity || 1))
      );
    }, 0)
    .toFixed(2);

  const prepareOrderData = () => {
    return {
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
        price:
          typeof item.price === "string"
            ? parseFloat(item.price.replace("€", "").replace(",", "."))
            : item.price,
      })),
      total: parseFloat(totalAmount),
    };
  };

  const handleCheckout = async () => {
    if (!token) {
      navigate("/konto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = prepareOrderData();

      const response = await axios.post(
        "http://localhost:1312/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Bestellung erfolgreich abgeschlossen!");
        setShowModal(true); // Modal anzeigen

        // Sende Benachrichtigung
        try {
          const notificationResponse = await axios.post(
            "http://localhost:1312/api/notify-admin/notifications",
            {
              type: "order",
              message: `Eine neue Bestellung wurde aufgegeben. Bestell-ID: ${response.data.orderId}.`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Benachrichtigung gesendet:", notificationResponse.data);
        } catch (notificationError) {
          console.error(
            "Fehler beim Senden der Benachrichtigung:",
            notificationError.message
          );
          setError("Fehler beim Senden der Benachrichtigung.");
        }

        clearCart();
      } else {
        setError(
          "Fehler beim Abschließen der Bestellung. Bitte versuche es erneut."
        );
      }
    } catch (error) {
      setError(
        "Es gab ein Problem bei der Bestellung. Bitte versuche es später erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "ASN-Y6PN9gc5OIAIQQWCMgDQXTTt_sGAxEw5-R_xPexA95xgPQmha2h8s2I2iAXxkEjFXUgpKt_K6vHr",
      }}
    >
      <div className="w-4/5 mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <FaShoppingCart className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-lg">
              Dein Warenkorb ist derzeit leer...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-20 h-25 object-contain mr-4"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm font-semibold">
                        {item.price}€ x {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              {success && (
                <p className="text-green-500 text-lg font-semibold mb-4">
                  {success}
                </p>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-4">
                  Gesamtsumme: {totalAmount} €
                </h3>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-md w-full mb-4 hover:bg-green-600"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Bestellung wird verarbeitet..." : "Zur Kasse"}
                </button>

                {error && <p className="text-red-500">{error}</p>}

                <p className="text-gray-500 my-4">
                  ---------------------oder express kaufen-------------------
                </p>

                <div className="w-full mb-4 buttons-container z-0">
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalAmount,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const details = await actions.order.capture();
                        alert(
                          `Transaktion abgeschlossen durch ${details.payer.name.given_name}`
                        );
                        await handleCheckout(); // Bestellung abschicken
                      } catch (error) {
                        alert(
                          "Es gab ein Problem bei der Zahlungsabwicklung. Bitte versuche es erneut."
                        );
                      }
                    }}
                    onError={(err) => {
                      alert(
                        "Es gab ein Problem bei der Verbindung zu PayPal. Bitte versuche es später erneut."
                      );
                    }}
                  />
                </div>

                <p className="text-gray-600 mt-4">Kostenloser Versand ab 90€</p>
              </div>
            </div>
          </div>
        )}

        {!token && (
          <div className="flex justify-center items-center pt-4">
            <div className="w-4/5 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
              Du musst eingeloggt sein, um den Warenkorb zu verwalten. Bitte{" "}
              <a href="/konto" className="text-blue-500 underline">
                logge dich hier ein
              </a>
              .
            </div>
          </div>
        )}

        {/* Erfolgsmeldung als Pop-up anzeigen */}
        <SuccessModal show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </PayPalScriptProvider>
  );
};

export default Warenkorb;
