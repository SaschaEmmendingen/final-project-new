import { useState } from 'react';

const Kontakt = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    // Hier könntest du den Formularinhalt weiterverarbeiten, z.B. eine E-Mail senden oder die Daten an einen Server schicken

    // Nach einer kurzen Zeit die Erfolgsmeldung wieder ausblenden
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="w-4/5 mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 text-white gap-8 rounded-md p-8" style={{ background: "linear-gradient(#78716c, #292524 10%)" }}>
      {/* Linke Spalte: Kontaktinformationen */}
      <div>
      <h1
        className="text-3xl font-bold my-8 text-center text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Kontakt
      </h1>
        <p>
          Bei allen weiteren Fragen steht unser Customer Care Team sehr gern zur Verfügung.
          Kontaktiere uns, wir beraten gerne!
        </p>
        <h3 className="text-lg font-semibold mt-4">Unsere Kontaktdaten:</h3>
        <p >Telefon: +49 351 89 88 14 44 (Mo.-Fr. 08.00 -16.00 Uhr)</p>
        <p>E-Mail: info@electro-ecom.com</p>
        <p>Hausanschrift: electro-ecom GmbH, LippeStraße Str. 1, 40221 Düsseldorf, Deutschland</p>
        <p className="mt-4">
        Bitte beachten Sie: Unsere Verwaltung, das Büro und der Kundendienst befinden sich an dieser Adresse. Alle Bestellungen werden direkt aus unserem Zentrallager an die in der Bestellung angegebene Lieferadresse versendet. Aus technischen Gründen ist eine Selbstabholung der bestellten Ware derzeit leider nicht möglich.
        </p>

        {/* Eingebettete Google Maps Karte */}
        <div className="mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2430.619301149563!2d13.806258915636822!3d51.03325977956092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4709cf3fae73cfaf%3A0xf46b1e79c6b65ed1!2sGlash%C3%BCtter%20Str.%20100%2C%2001277%20Dresden%2C%20Deutschland!5e0!3m2!1sen!2sde!4v1692350784476!5m2!1sen!2sde"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Google Maps Standort"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

      {/* Rechte Spalte: Kontaktformular */}
      <div>
      <h2
        className="text-3xl font-bold my-8 text-center text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Kontaktformular
      </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              placeholder="Dein Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">E-Mail</label>
            <input
              type="email"
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              placeholder="Deine E-Mail"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Telefonnummer (optional)</label>
            <input
              type="tel"
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              placeholder="Deine Telefonnummer"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Betreff</label>
            <input
              type="text"
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              placeholder="Betreff der Nachricht"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Thema</label>
            <select className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2" required>
              <option value="">Bitte auswählen</option>
              <option>Bestellung</option>
              <option>Rückgabe</option>
              <option>Technische Unterstützung</option>
              <option>Allgemeine Anfrage</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nachricht</label>
            <textarea
              className="w-full border-0 border-gray-300 p-2 bg-stone-600 rounded outline-none mt-2"
              placeholder="Deine Nachricht"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-600"/>
              <span className="ml-2 text-sm">Ich möchte den Newsletter abonnieren</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-stone-600 text-white rounded hover:bg-stone-700 text-xs p-2 pl-4 pr-4 mr-4 mt-4 transition duration-300"
          >
            Senden
          </button>
        </form>

        {/* Erfolgsmeldung */}
        {formSubmitted && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
            Deine Nachricht wurde erfolgreich übermittelt! Wir werden uns so bald wie möglich bei dir melden.
          </div>
        )}
      </div>
    </div>
  );
};

export default Kontakt;
