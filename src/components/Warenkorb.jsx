/* eslint-disable no-unused-vars */
import React from 'react';
import { useCart } from '../components/CartContext';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Warenkorb = () => {
  const { cartItems, removeFromCart } = useCart();

  // Gesamtsumme berechnen
  const totalAmount = cartItems.reduce(
    (total, item) => total + parseFloat(item.price.replace("€", "").replace(",", ".")),
    0
  ).toFixed(2);

  return (
    <PayPalScriptProvider options={{ "client-id": "ASN-Y6PN9gc5OIAIQQWCMgDQXTTt_sGAxEw5-R_xPexA95xgPQmha2h8s2I2iAXxkEjFXUgpKt_K6vHr" }}> 
      <div className="w-4/5 mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <FaShoppingCart className="text-gray-400 text-6xl mb-4" /> 
            <p className="text-gray-500 text-lg">Dein Warenkorb ist derzeit leer...</p> 
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
                      <p className="text-sm font-semibold">{item.price}</p>
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
                <h3 className="text-xl font-bold mb-4">Gesamtsumme: {totalAmount} €</h3>
                
                {/* Grüner Button "Zur Kasse" geht aber nicht der ist provisorisch */}
                <button className="bg-green-500 text-white py-2 px-4 rounded-md w-full mb-4 hover:bg-green-600">
                  Zur Kasse
                </button>

                {/* Trennlinie und Express-Kauf Text so wie bei anderen Shops */}
                <p className="text-gray-500 my-2">---------------------oder express kaufen-------------------</p>

                {/* PayPal Button von npm*/}
                <div className="w-full mb-4">
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: totalAmount, // Die Gesamtsumme der Warenkorbartikel
                          },
                        }],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const details = await actions.order.capture();
                        alert(`Transaktion abgeschlossen durch ${details.payer.name.given_name}`);
                      } catch (error) {
                        console.error('Fehler bei der Zahlungsabwicklung:', error);
                        alert('Es gab ein Problem bei der Zahlungsabwicklung. Bitte versuche es erneut.');
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal-Fehler:', err);
                      alert('Es gab ein Problem bei der Verbindung zu PayPal. Bitte versuche es später erneut.');
                    }}
                  />
                </div>

                {/* Versandhinweis zu ende*/}
                <p className="text-gray-600 mt-4">Kostenloser Versand ab 90€</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Warenkorb;
