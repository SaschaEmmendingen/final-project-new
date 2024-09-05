import React from "react";
import { useCart } from "../components/CartContext";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useAuth } from "./Main/AuthContext"; // Importiere den AuthContext
import { useNavigate } from "react-router-dom";

const Warenkorb = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { token } = useAuth(); // Hole Token aus dem AuthContext
  const navigate = useNavigate();

  // Gesamtsumme berechnen
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

  // Funktion zum Vorbereiten der Bestelldaten
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

  // Funktion zum Senden der Bestellung an das Backend
  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const orderData = prepareOrderData();
  
      console.log('Bestell-Daten:', orderData); // Debugging-Informationen
  
      const response = await axios.post('http://localhost:1312/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Server-Antwort:', response); // Debugging-Informationen
  
      if (response.status === 201) {
        alert('Bestellung erfolgreich abgeschlossen!');
        clearCart(); // Leere den Warenkorb nur, wenn die Bestellung erfolgreich war
        navigate('/'); // Weiterleitung zur Startseite oder zu einer Bestellbestätigungsseite
      } else {
        console.error('Unerwarteter Statuscode:', response.status); // Debugging-Informationen
        alert('Fehler beim Abschließen der Bestellung. Bitte versuche es erneut.');
      }
    } catch (error) {
      console.error('Fehler beim Abschließen der Bestellung:', error.response ? error.response.data : error.message);
      alert('Es gab ein Problem bei der Bestellung. Bitte versuche es später erneut.');
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
          <div className="grid grid-cols-2 gap-4">
            {/* Linke Col: Liste der Warenkorb-Artikel */}
            <div>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-25 object-contain mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm font-semibold">
                        {item.price} x {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item)} // Produkt aus dem Warenkorb entfernen
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* Rechte Col: Gesamtsumme + Buttons */}
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  Gesamtsumme: {totalAmount} €
                </h3>

                {/* Grüner Button "Zur Kasse" */}
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-md w-full mb-4 hover:bg-green-600"
                  onClick={handleCheckout} // Bestellung an das Backend senden
                >
                  Zur Kasse
                </button>

                {/* Trennlinie und Express-Kauf Text */}
                <p className="text-gray-500 my-2">
                  ---------------------oder express kaufen-------------------
                </p>

                {/* PayPal Button von npm*/}
                <div className="w-full mb-4">
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalAmount, // Die Gesamtsumme der Warenkorbartikel
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
                        // Hier kannst du die Bestellung ebenfalls an das Backend senden, wenn gewünscht
                        await handleCheckout(); // Bestellung abschicken
                      } catch (error) {
                        console.error(
                          "Fehler bei der Zahlungsabwicklung:",
                          error
                        );
                        alert(
                          "Es gab ein Problem bei der Zahlungsabwicklung. Bitte versuche es erneut."
                        );
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal-Fehler:", err);
                      alert(
                        "Es gab ein Problem bei der Verbindung zu PayPal. Bitte versuche es später erneut."
                      );
                    }}
                  />
                </div>

                {/* Versandhinweis */}
                <p className="text-gray-600 mt-4">Kostenloser Versand ab 90€</p>
              </div>
            </div>
          </div>
        )}

        {/* Zeige eine Nachricht an, wenn der Benutzer nicht eingeloggt ist */}
        {!token && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            Du musst eingeloggt sein, um eine Bestellung aufzugeben. Bitte{" "}
            <a href="/login" className="text-blue-500 underline">
              logge dich hier ein
            </a>
            .
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Warenkorb;
