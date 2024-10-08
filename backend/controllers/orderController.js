import Order from "../models/Order.js";
import User from "../models/User.js";
import axios from "axios"; // Falls noch nicht importiert

// Hole alle Bestellungen (nur Admins)
export const getAllOrders = async (req, res) => {
  try {
    console.log("Hole alle Bestellungen (Admin)");

    const orders = await Order.find()
      .populate("items.productId")
      .populate("user");

    console.log("Bestellungen gefunden:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hole Bestellungen für den angemeldeten Benutzer
export const getMyOrders = async (req, res) => {
  try {
    console.log("Hole Bestellungen für User:", req.user._id);

    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .populate("user");

    console.log("Bestellungen für User gefunden:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Erstelle eine neue Bestellung
export const createOrder = async (req, res) => {
  const { items, total } = req.body;

  console.log("Bestellung anlegen mit:", { items, total });

  // Validierung der Daten
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error("Fehlende Daten bei der Bestellung");
    return res.status(400).json({ message: "Fehlende Daten" });
  }

  if (typeof total !== "number" || total <= 0) {
    console.error("Ungültiger Gesamtbetrag:", total);
    return res.status(400).json({ message: "Ungültiger Gesamtbetrag" });
  }

  // Überprüfen, ob jedes Item ein productId-Feld hat
  for (const item of items) {
    if (!item.productId) {
      console.error("Fehlendes productId bei Item:", item);
      return res.status(400).json({
        message: "Ein oder mehrere Produkte fehlen das productId-Feld",
      });
    }
  }

  try {
    // Bestellung erstellen
    const newOrder = new Order({ items, total, user: req.user._id });
    await newOrder.save();

    console.log(`Bestellung erstellt: ${newOrder._id}`);

    // Aktivität aufzeichnen
    const activity = {
      type: "Order Created",
      description: `Bestellung #${newOrder._id} wurde erstellt.`,
    };

    // Füge die Aktivität zum User hinzu
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { activities: activity } },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`User mit ID ${req.user._id} nicht gefunden`);
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    console.log(`Aktivität hinzugefügt für User ${req.user._id}`);

    // Erfolgsmeldung zurückgeben
    res.status(201).json({
      message: "Bestellung erfolgreich erstellt",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Fehler beim Erstellen der Bestellung:", error.message);
    res.status(500).json({ message: "Serverfehler" });
  }
};

// Lösche eine Bestellung
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    console.log(`Lösche Bestellung: ${orderId}, für User: ${userId}`);

    // Überprüfe, ob der Benutzer ein Administrator ist
    if (req.user.role === "admin") {
      // Wenn Admin, lösche jede Bestellung
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        console.error("Bestellung nicht gefunden:", orderId);
        return res.status(404).json({ message: "Bestellung nicht gefunden" });
      }

      console.log("Bestellung erfolgreich gelöscht:", orderId);
      return res.json({ message: "Bestellung erfolgreich gelöscht" });
    } else {
      // Wenn Benutzer, lösche nur die eigene Bestellung
      const deletedOrder = await Order.findOneAndDelete({
        _id: orderId,
        user: userId,
      });

      if (!deletedOrder) {
        console.error(
          "Bestellung nicht gefunden oder nicht berechtigt:",
          orderId
        );
        return res
          .status(404)
          .json({ message: "Bestellung nicht gefunden oder nicht berechtigt" });
      }

      console.log("Bestellung erfolgreich gelöscht:", orderId);
      return res.json({ message: "Bestellung erfolgreich gelöscht" });
    }
  } catch (error) {
    console.error("Fehler beim Löschen der Bestellung:", error);
    res.status(500).json({ message: "Fehler beim Löschen der Bestellung" });
  }
};

// Hole eine Bestellung nach ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Hole Bestellung nach ID:", orderId);

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("user");

    if (!order) {
      console.error("Bestellung nicht gefunden:", orderId);
      return res.status(404).json({ message: "Bestellung nicht gefunden" });
    }

    console.log("Bestellung gefunden:", order);
    res.json(order);
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellung:", error);
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Bestellung", error });
  }
};

// Rückgabe einer Bestellung
export const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason, items } = req.body;

    console.log("Bearbeite Rücksendung für Bestellung:", orderId);
    console.log("Rückgabegrund:", reason);
    console.log("Artikel für Rücksendung:", items);

    // Überprüfe, ob die Bestellung existiert
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      console.error("Bestellung nicht gefunden:", orderId);
      return res.status(404).json({ message: "Bestellung nicht gefunden" });
    }

    // Überprüfe, ob der Benutzer der Besteller ist
    if (order.user.toString() !== req.user._id.toString()) {
      console.error("Unberechtigter Rückgabeversuch durch User:", req.user._id);
      return res.status(401).json({
        message: "Sie können nur Ihre eigenen Bestellungen retournieren",
      });
    }

    console.log("Bestellung validiert für Rücksendung");

    // Zeige alle Artikel in der Bestellung an
    console.log(
      "Artikel in der Bestellung:",
      order.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
      }))
    );

    // Füge die Rücksendedetails hinzu
    const returnDetails = {
      reason,
      items: items.map((item) => {
        // Überprüfen, ob der Artikel in der Bestellung vorhanden ist
        const orderItem = order.items.find(
          (i) => i.productId._id.toString() === item.itemId
        );

        if (!orderItem) {
          console.error(
            `Artikel mit ID ${item.itemId} nicht in der Bestellung gefunden`
          );
          throw new Error(
            `Artikel mit ID ${item.itemId} nicht in der Bestellung gefunden`
          );
        }

        return {
          productId: orderItem.productId,
          name: orderItem.productId.name,
          quantity: item.quantity, // Hier ist die Menge der Rücksendung
        };
      }),
    };

    order.returns.push(returnDetails);

    console.log("Rücksendedetails hinzugefügt:", returnDetails);

    // Speichere die Bestellung mit den Rücksendedaten
    await order.save();

    console.log("Bestellung mit Rücksendedaten gespeichert");

    // Aktivität aufzeichnen
    const activity = {
      type: "Return Created",
      description: `Bestellung #${orderId} wurde zurückgegeben.`,
    };

    // Füge die Aktivität zum User hinzu
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { activities: activity } },
      { new: true }
    );

    console.log("Rücksendungsaktivität hinzugefügt für User:", req.user._id);

    res.status(200).json({ message: "Rücksendung erfolgreich verarbeitet" });
  } catch (error) {
    console.error("Fehler bei der Rücksendung:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
};
