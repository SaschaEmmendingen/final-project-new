import Order from '../models/Order.js';

const createOrder = async (req, res) => {
  const { items, total } = req.body;

  // Validierung der Daten
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Fehlende Daten' });
  }

  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({ message: 'Ungültiger Gesamtbetrag' });
  }

  // Überprüfen, ob jedes Item ein productId-Feld hat
  for (const item of items) {
    if (!item.productId) {
      return res.status(400).json({ message: 'Ein oder mehrere Produkte fehlen das productId-Feld' });
    }
  }

  try {
    const newOrder = new Order({ items, total });
    await newOrder.save();
    res.status(200).json({ message: 'Bestellung erfolgreich erstellt' });
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
};

export default createOrder;