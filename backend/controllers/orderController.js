import Order from "../models/Order.js";
import User from "../models/User.js";
import axios from "axios"; // Falls noch nicht importiert

// Hole alle Bestellungen (nur Admins)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("user");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hole Bestellungen für den angemeldeten Benutzer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .populate("user");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Erstelle eine neue Bestellung

export const createOrder = async (req, res) => {
  const { items, total } = req.body;

  // Validierung der Daten
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Fehlende Daten" });
  }

  if (typeof total !== "number" || total <= 0) {
    return res.status(400).json({ message: "Ungültiger Gesamtbetrag" });
  }

  // Überprüfen, ob jedes Item ein productId-Feld hat
  for (const item of items) {
    if (!item.productId) {
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

    // Benachrichtigung an den Admin senden
    console.log(
      "Admin-Benachrichtigung URL:",
      "http://localhost:1312/api/notify-admin"
    );
    try {
      const notificationResponse = await axios.post(
        "http://localhost:1312/api/notify-admin",
        { message: `Neue Bestellung erstellt: ID #${newOrder._id}` },
        { headers: { Authorization: `Bearer ${req.token}` } }
      );
      console.log(
        "Admin-Benachrichtigung erfolgreich gesendet",
        notificationResponse.data
      );
    } catch (notificationError) {
      console.error(
        "Fehler beim Senden der Admin-Benachrichtigung:",
        notificationError.message
      );
      return res
        .status(500)
        .json({ message: "Fehler beim Senden der Admin-Benachrichtigung" });
    }

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

    // Überprüfe, ob der Benutzer ein Administrator ist
    if (req.user.role === "admin") {
      // Wenn Admin, lösche jede Bestellung
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Bestellung nicht gefunden" });
      }

      return res.json({ message: "Bestellung erfolgreich gelöscht" });
    } else {
      // Wenn Benutzer, lösche nur die eigene Bestellung
      const deletedOrder = await Order.findOneAndDelete({
        _id: orderId,
        user: userId,
      });

      if (!deletedOrder) {
        return res
          .status(404)
          .json({ message: "Bestellung nicht gefunden oder nicht berechtigt" });
      }

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
    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("user");

    if (!order) {
      return res.status(404).json({ message: "Bestellung nicht gefunden" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Bestellung", error });
  }
};
// // Hole eine Bestellung nach ID (Admin kann alle Bestellungen sehen)
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("items.productId")
//       .populate("user");
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason, items } = req.body;

    // Überprüfe, ob die Bestellung existiert
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Bestellung nicht gefunden" });
    }

    // Überprüfe, ob der Benutzer der Besteller ist
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Sie können nur Ihre eigenen Bestellungen retournieren",
      });
    }

    // Füge die Rücksendedetails hinzu
    const returnDetails = {
      reason,
      items: items.map((itemId) => {
        const orderItem = order.items.find(
          (i) => i.productId._id.toString() === itemId
        );
        return {
          productId: orderItem.productId,
          name: orderItem.productId.name,
          quantity: orderItem.quantity,
        };
      }),
    };

    order.returns.push(returnDetails);

    // Speichere die Bestellung mit den Rücksendedaten
    await order.save();

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

    // Benachrichtigung an den Admin senden
    console.log(
      "Admin-Benachrichtigung URL:",
      "http://localhost:1312/api/notify-admin"
    );
    try {
      const notificationResponse = await axios.post(
        "http://localhost:1312/api/notify-admin",
        { message: `Rücksendung für Bestellung ID #${orderId} erstellt.` },
        { headers: { Authorization: `Bearer ${req.token}` } }
      );
      console.log(
        "Admin-Benachrichtigung erfolgreich gesendet",
        notificationResponse.data
      );
    } catch (notificationError) {
      console.error(
        "Fehler beim Senden der Admin-Benachrichtigung:",
        notificationError.message
      );
      return res
        .status(500)
        .json({ message: "Fehler beim Senden der Admin-Benachrichtigung" });
    }

    res.status(200).json({ message: "Rücksendung erfolgreich verarbeitet" });
  } catch (error) {
    console.error("Fehler bei der Rücksendung:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
};
