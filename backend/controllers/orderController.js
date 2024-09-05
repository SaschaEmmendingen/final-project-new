import Order from '../models/Order.js';

// Erstelle eine neue Bestellung
export const createOrder = async (req, res) => {
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
    const newOrder = new Order({ items, total, user: req.user._id }); // Benutzer wird hier zugewiesen
    await newOrder.save();
    res.status(201).json({ message: 'Bestellung erfolgreich erstellt' });
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
};

// Lösche eine Bestellung
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    // Überprüfe, ob der Benutzer ein Administrator ist
    if (req.user.role === 'admin') {
      // Wenn Admin, lösche jede Bestellung
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Bestellung nicht gefunden' });
      }
      
      return res.json({ message: 'Bestellung erfolgreich gelöscht' });
    } else {
      // Wenn Benutzer, lösche nur die eigene Bestellung
      const deletedOrder = await Order.findOneAndDelete({ _id: orderId, user: userId });
      
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Bestellung nicht gefunden oder nicht berechtigt' });
      }
      
      return res.json({ message: 'Bestellung erfolgreich gelöscht' });
    }
  } catch (error) {
    console.error('Fehler beim Löschen der Bestellung:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Bestellung' });
  }
};

// Hole eine Bestellung nach ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Bestellung', error });
  }
};