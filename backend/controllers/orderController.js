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

export const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason, items } = req.body;

    console.log("Order ID:", orderId); // Log der Order ID
    console.log("Return Reason:", reason); // Log des Rücksendegrunds
    console.log("Selected Items:", items); // Log der ausgewählten Artikel

    // Überprüfe, ob die Bestellung existiert
    const order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    console.log("Order found:", order); // Log der gefundenen Bestellung

    // Überprüfe, ob der Benutzer der Besteller ist
    if (order.user.toString() !== req.user._id.toString()) {
      console.log("Unauthorized user");
      return res.status(401).json({ message: 'Sie können nur Ihre eigenen Bestellungen retournieren' });
    }

    console.log("Authorized user:", req.user._id); // Log der Benutzer-ID

    // Füge die Rücksendedetails hinzu
    const returnDetails = {
      reason,
      items: items.map(itemId => {
        const orderItem = order.items.find(i => i.productId.toString() === itemId);
        return {
          productId: orderItem.productId,
          quantity: orderItem.quantity,
        };
      }),
    };

    console.log("Return details:", returnDetails); // Log der Rücksendedetails

    order.returns.push(returnDetails);

    // Speichere die Bestellung mit den Rücksendedaten
    await order.save();

    console.log("Return saved successfully"); // Log der erfolgreichen Speicherung
    res.status(200).json({ message: 'Rücksendung erfolgreich verarbeitet' });
  } catch (error) {
    console.error('Fehler bei der Rücksendung:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
};