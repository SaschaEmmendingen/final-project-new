import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Product from '../models/Product.js'; // Beispiel für zusätzliche Modelle
import Order from '../models/Order.js'; // Beispiel für zusätzliche Modelle

export const getAdminDashboard = async (req, res) => {
  try {
    // Gesamtanzahl der Benutzer
    const userCount = await User.countDocuments();

    // Gesamtanzahl der Produkte
    const productCount = await Product.countDocuments();

    // Gesamtanzahl der Bestellungen
    const orderCount = await Order.countDocuments();

    // Neueste Registrierungen (z.B. der letzten 30 Tage)
    const recentUsers = await User.find({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } }).limit(5);

    // Neueste Bestellungen (z.B. der letzten 30 Tage)
    const recentOrders = await Order.find({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } }).limit(5);

    // Dashboard-Daten zusammenstellen
    const dashboardData = {
      userCount,
      productCount,
      orderCount,
      recentUsers,
      recentOrders
    };

    res.json({ message: 'Willkommen im Admin-Dashboard', data: dashboardData });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Dashboard-Daten', error });
  }
};

// ! Admin erstellen
export const createAdmin = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  
  try {
    const admin = new Admin({ name, email, password, address, phone, role: 'admin' });
    await admin.save();
    res.status(201).json({ message: 'Admin erstellt', admin });
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen des Admins', error });
  }
};

// ! Admin abrufen
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nicht gefunden' });
    }
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Abrufen des Admins', error });
  }
};

// Alle Admins abrufen
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Abrufen der Admins', error });
  }
};

// ! Admin aktualisieren
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin nicht gefunden' });
    }
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Admins', error });
  }
};

// ! Admin löschen
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin nicht gefunden' });
    }
    res.json({ message: 'Admin gelöscht' });
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Löschen des Admins', error });
  }
};

//  ____________________________________________________________________________________

// ! Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin nicht gefunden' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültiges Passwort' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        address: admin.address,
        phone: admin.phone,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error });
  }
};