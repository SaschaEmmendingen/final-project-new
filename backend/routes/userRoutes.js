import express from "express";
import {
  registerUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentifizierung erforderlich für folgende Routen
// router.use(protect); // Alle nachfolgenden Routen erfordern Authentifizierung

// Benutzerprofil des angemeldeten Benutzers abrufen
router.get("/profile", getUserProfile);

// Benutzer nach ID abrufen
router.get("/:id", getUser);

// Alle Benutzer auflisten - nur für Admins
router.get("/", isAdmin, getAllUsers);

// Benutzer aktualisieren - nur für Admins
router.put("/:id", isAdmin, updateUser);

// Benutzer löschen - nur für Admins
router.delete("/:id", isAdmin, deleteUser);

export default router;
