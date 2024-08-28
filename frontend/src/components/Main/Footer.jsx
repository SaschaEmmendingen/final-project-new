/* eslint-disable no-unused-vars */
import React from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-200 text-gray-800 py-8 mt-14">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Bestellungen */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Bestellungen</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-gray-700">Mein Konto</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Meine Bestellungen</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Warenkorb</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Rücksendungen</a>
                            </li>
                        </ul>
                    </div>

                    {/* Informationen */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Informationen</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-gray-700">Über uns</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Datenschutz</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">AGB</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Hilfe & FAQ</a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Ihr Konto */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Ihr Konto</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-gray-700">Anmelden</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Registrieren</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-700">Passwort vergessen</a>
                            </li>
                        </ul>
                    </div>

                    {/* Electro-Ecom */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Electro-Ecom</h3>
                        <p>Wir bieten Ihnen die besten Elektronikprodukte zu unschlagbaren Preisen.</p>
                        <p>&copy; {new Date().getFullYear()} Electro-Ecom</p>
                    </div>

                    {/* Kontakt */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
                        <div className="flex items-center justify-center md:justify-start mb-2">
                            <FaPhone className="mr-2" />
                            <a href="tel:+123456789" className="hover:text-gray-700">+123 456 789</a>
                        </div>
                        <div className="flex items-center justify-center md:justify-start mb-2">
                            <FaEnvelope className="mr-2" />
                            <a href="mailto:info@electro-ecom.com" className="hover:text-gray-700">
                                info@electro-ecom.com
                            </a>
                        </div>
                        <div className="flex items-center justify-center md:justify-start mb-2">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>123 Elektronikstraße, Berlin</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start">
                            <FaClock className="mr-2" />
                            <span>Mo-Fr: 9:00 - 18:00</span>
                        </div>
                    </div>
                </div>

                {/* Optional: Einfache Zeilen- oder Trennlinie */}
                <div className="border-t border-gray-300 my-8"></div>

                <div className="text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Electro-Ecom. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
