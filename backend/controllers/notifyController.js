import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

export const manageNotifications = async (req, res) => {
  const { method } = req;

  try {
    switch (method) {
      case "POST": {
        const { message, recipients } = req.body;

        // Validate the request body
        if (!message || !recipients || recipients.length === 0) {
          return res
            .status(400)
            .json({ message: "Nachricht und Empfänger sind erforderlich." });
        }

        console.log("Current User:", req.user); // Log for current user
        console.log("Request Body:", req.body); // Log incoming request body

        const senderModel = req.user.role === "admin" ? "Admin" : "User"; // Determine sender model
        const recipientModel = recipients[0].startsWith("admin_")
          ? "Admin"
          : "User";

        const newNotification = new Notification({
          sender: req.user._id,
          senderModel,
          recipients: recipients.map((id) => id.replace("admin_", "")),
          recipientModel,
          messages: [{ sender: req.user._id, message }],
        });

        // Save the notification to the database
        await newNotification.save();
        console.log("Neue Benachrichtigung:", newNotification); // Log new notification

        await Promise.all(
          recipients.map(async (recipientId) => {
            const id = recipientId.replace("admin_", "");
            const Model = recipientModel === "Admin" ? Admin : User;
            const recipientExists = await Model.findById(id);
            if (recipientExists) {
              await Model.findByIdAndUpdate(id, {
                $push: { notifications: newNotification._id },
              });
            } else {
              console.error(`Recipient not found: ${id}`);
            }
          })
        );

        return res.status(201).json({
          message: "Benachrichtigung erfolgreich gesendet.",
          notification: newNotification,
        });
      }

      case "GET": {
        const notifications = await Notification.find({
          $or: [
            { recipients: req.user._id }, // Notifications where the user is a recipient
            { sender: req.user._id }, // Notifications sent by the user
          ],
        })
          .populate("sender") // Populate sender
          .populate("recipients"); // Populate recipients

        // Format notifications
        const formattedNotifications = notifications.map((notification) => ({
          id: notification._id,
          senderName: notification.sender
            ? notification.sender.name
            : "Unbekannt",
          recipientNames: notification.recipients
            .map((recipient) => recipient.name)
            .join(", "), // Join recipient names
          messages: notification.messages,
          createdAt: notification.createdAt,
        }));

        return res.status(200).json(formattedNotifications);
      }

      case "DELETE": {
        const { id } = req.params;

        const notification = await Notification.findById(id);
        if (!notification) {
          return res
            .status(404)
            .json({ message: "Benachrichtigung nicht gefunden." });
        }

        await User.updateMany(
          { notifications: id },
          { $pull: { notifications: id } }
        );
        await Admin.updateMany(
          { notifications: id },
          { $pull: { notifications: id } }
        );

        await Notification.findByIdAndDelete(id);

        return res
          .status(200)
          .json({ message: "Benachrichtigung erfolgreich gelöscht." });
      }

      case "PUT": {
        const { notificationId, replyMessage } = req.body;

        // Validate the PUT request
        if (!replyMessage || !notificationId) {
          return res.status(400).json({
            message:
              "Antwortnachricht und Benachrichtigungs-ID sind erforderlich.",
          });
        }

        // Validate the notificationId
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
          return res
            .status(400)
            .json({ message: "Ungültige Benachrichtigungs-ID." });
        }

        const notification = await Notification.findById(notificationId);
        if (!notification) {
          return res
            .status(404)
            .json({ message: "Benachrichtigung nicht gefunden." });
        }

        // Add reply to the notification
        notification.messages.push({
          sender: req.user._id,
          message: replyMessage,
        });

        await notification.save();
        return res.status(200).json(notification);
      }

      default:
        return res.status(405).json({ message: "Methode nicht erlaubt." });
    }
  } catch (error) {
    console.error("Error in manageNotifications:", error); // Log error details
    return res
      .status(500)
      .json({ message: "Interner Serverfehler.", error: error.message });
  }
};
