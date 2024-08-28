import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Registrieren
router.post("/register", async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    // Überprüfen, ob der Benutzer bereits existiert
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Benutzer erstellen
    const user = await User.create({
      name,
      email,
      password,
      address,
      phone,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.status(201).json({
        message: "Registration successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("User data:", user); // Überprüfe die vollständigen Benutzerdaten

  if (!user) {
    return res.status(404).json({ message: "No user found with this email" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    // Sende die Rolle explizit zurück
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      role: user.role, // Die Rolle hier zurückgeben
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Batch-Registrierung
// router.post("/register/batch", async (req, res) => {
//   const users = req.body; // Erwartet ein Array von Benutzerdaten

//   try {
//     // Benutzer erstellen
//     const createdUsers = await User.insertMany(users);

//     const tokens = createdUsers.map((user) => ({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "30d",
//       }),
//     }));

//     res.status(201).json({
//       message: "Batch registration successful",
//       users: tokens,
//     });
//   } catch (error) {
//     console.error("Error in batch registration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

export default router;
