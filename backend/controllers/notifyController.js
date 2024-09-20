import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const sendNotificationToAdmin = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ message: "Keine Nachricht bereitgestellt" });
    }

    console.log("Empfangene Nachricht:", message);

    // Alle Admins finden
    const admins = await Admin.find({ role: "admin" });

    if (admins.length === 0) {
      console.log("Keine Admins gefunden");
      return res.status(404).json({ message: "Keine Admins gefunden" });
    }

    console.log("Gefundene Admins:", admins);

    // Benachrichtigung an alle Admins hinzufügen
    for (let admin of admins) {
      admin.notifications.push({
        message: message,
        date: new Date(),
      });
      await admin.save();
    }
    res
      .status(200)
      .json({ message: "Benachrichtigung an alle Admins gesendet." });
  } catch (error) {
    console.error("Fehler beim Senden der Benachrichtigung:", error);
    res
      .status(500)
      .json({ message: "Fehler beim Senden der Benachrichtigung.", error });
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Alle Admins finden
    const admins = await Admin.find({ role: "admin" });

    // Alle Benachrichtigungen von allen Admins zusammenfassen
    const notifications = admins
      .flatMap((admin) => admin.notifications)
      .sort((a, b) => b.date - a.date);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benachrichtigungen:", error);
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Benachrichtigungen.", error });
  }
};

export const clearAllNotifications = async (req, res) => {
    try {
      // Alle Admins abrufen
      const admins = await Admin.updateMany(
        { role: "admin" }, 
        { $set: { notifications: [] } } // Setze die Benachrichtigungen für alle Admins auf ein leeres Array
      );
  
      if (!admins) {
        return res.status(404).json({ message: 'Keine Admins gefunden' });
      }
  
      res.status(200).json({ message: 'Benachrichtigungen erfolgreich gelöscht' });
    } catch (error) {
      console.error('Fehler beim Löschen der Benachrichtigungen:', error);
      res.status(500).json({ message: 'Fehler beim Löschen der Benachrichtigungen' });
    }
  };

  // Einzelne Benachrichtigung löschen
  export const deleteNotificationById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Alle Admins durchlaufen und die Benachrichtigung entfernen
      await Admin.updateMany(
        { role: 'admin' },
        { $pull: { notifications: { _id: id } } } // Benachrichtigung anhand der ID entfernen
      );
  
      res.status(200).json({ message: 'Benachrichtigung erfolgreich gelöscht.' });
    } catch (error) {
      console.error('Fehler beim Löschen der Benachrichtigung:', error);
      res.status(500).json({ message: 'Fehler beim Löschen der Benachrichtigung.' });
    }
  };

  export const sendNotificationToUsers = async (req, res) => {
    try {
      const { message, recipients } = req.body;
  
      if (!message || !recipients || recipients.length === 0) {
        return res.status(400).json({ message: "Nachricht oder Empfänger nicht bereitgestellt." });
      }
  
      // Erstelle eine Benachrichtigung
      const notification = new Notification({ message, date: new Date() });
  
      // Finde und sende die Benachrichtigung an die Empfänger
      for (const recipientId of recipients) {
        const user = await User.findById(recipientId);
        const admin = await Admin.findById(recipientId);
  
        if (user) {
          user.notifications.push(notification);
          await user.save();
        } else if (admin) {
          admin.notifications.push(notification);
          await admin.save();
        }
      }
  
      res.status(200).json({ message: "Benachrichtigung erfolgreich gesendet." });
    } catch (error) {
      console.error("Fehler beim Senden der Benachrichtigung:", error);
      res.status(500).json({ message: "Fehler beim Senden der Benachrichtigung.", error });
    }
  };
  