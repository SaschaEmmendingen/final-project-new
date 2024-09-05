import express from "express";
import {
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminDashboard,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Dashboard
router.get("/dashboard", protect, isAdmin, getAdminDashboard);

// Alle anderen Admin-Routen erfordern Authentifizierung und Admin-Rolle
router.use(protect); // Alle nachfolgenden Routen erfordern Authentifizierung
router.use(isAdmin); // Alle nachfolgenden Routen erfordern Admin-Rolle

// Admin erstellen
router.post("/", createAdmin);

// Admin nach ID abrufen
router.get("/:id", getAdmin);

// Alle Admins abrufen
router.get("/", getAllAdmins);

// Admin aktualisieren
router.put("/:id", updateAdmin);

// Admin löschen
router.delete("/:id", deleteAdmin);

export default router;
