import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
// import { sendNotification } from "../webSocket/websocketServer.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    const recentUsers = await User.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).limit(5);
    const recentOrders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).limit(5);

    const dashboardData = {
      userCount,
      productCount,
      orderCount,
      recentUsers,
      recentOrders,
    };

    res.json({ message: "Willkommen im Admin-Dashboard", data: dashboardData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Dashboard-Daten", error });
  }
};

// CRUD für Admins
export const createAdmin = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    const admin = new Admin({
      name,
      email,
      password,
      address,
      phone,
      role: "admin",
    });
    await admin.save();
    res.status(201).json({ message: "Admin erstellt", admin });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Fehler beim Erstellen des Admins", error });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin nicht gefunden" });
    }
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Abrufen des Admins", error });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Abrufen der Admins", error });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin nicht gefunden" });
    }
    res.json(admin);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Fehler beim Aktualisieren des Admins", error });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin nicht gefunden" });
    }
    res.json({ message: "Admin gelöscht" });
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Löschen des Admins", error });
  }
};

// export const notifyUser = async (req, res) => {
//   const { userId, message } = req.body;

//   // Überprüfe, ob der Admin berechtigt ist, Benachrichtigungen zu senden
//   const admin = req.user; // Der Admin sollte durch die Middleware hinzugefügt worden sein

//   if (!admin || admin.role !== "admin") {
//     return res
//       .status(403)
//       .json({ message: "Keine Berechtigung, um Benachrichtigungen zu senden" });
//   }

//   try {
//     sendNotification(userId, message);
//     res.status(200).json({ message: "Benachrichtigung gesendet" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Fehler beim Senden der Benachrichtigung" });
//   }
// };
