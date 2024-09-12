import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

// Hole alle Aktivitäten eines Benutzers
export const getUserActivities = async (userId) => {
  try {
    const user = await User.findById(userId).populate('activities');

    if (!user) {
      throw new Error("Benutzer nicht gefunden");
    }

    return user.activities;
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktivitäten:", error);
    throw new Error("Serverfehler");
  }
};

// Hole das Benutzerprofil einschließlich der Aktivitäten
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Benutzer-ID vom JWT

    // Abrufen des Benutzers und seiner Bestellungen
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Abrufen der Aktivitäten des Benutzers
    const activities = await getUserActivities(userId);

    const profileData = {
      user,
      orders,
      activities, // Aktivitäten hinzufügen
    };

    res.json({ message: "Benutzerprofil abgerufen", data: profileData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen des Benutzerprofils", error: error.message });
  }
};

// CRUD für Benutzer
export const registerUser = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    const user = new User({ name, email, password, address, phone });
    await user.save();
    res.status(201).json({ message: "User registriert", user });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res
      .status(400)
      .json({ message: "Fehler bei der Registrierung des Users", error });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Abrufen des Users", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Abrufen der Users", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Update der Felder, wenn vorhanden
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    // Passwort nur ändern, wenn ein neues Passwort bereitgestellt wurde
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      message: "Profil aktualisiert",
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Aktualisieren des Benutzerprofils", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json({ message: "User gelöscht" });
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Löschen des Users", error });
  }
};