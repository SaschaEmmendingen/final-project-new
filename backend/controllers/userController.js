import User from "../models/User.js";
import Order from "../models/Order.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const profileData = {
      user,
      orders,
    };

    res.json({ message: "Benutzerprofil abgerufen", data: profileData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen des Benutzerprofils", error });
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Fehler beim Aktualisieren des Users", error });
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
