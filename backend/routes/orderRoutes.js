import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js"; // Benannte Exporte importieren
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  returnOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Hole alle Bestellungen (nur Admins)
router.get("/", protect, isAdmin, getAllOrders);

// Hole Bestellungen für den angemeldeten Benutzer
router.get("/my-orders", protect, getMyOrders);

// Hole eine Bestellung nach ID (Admin kann alle Bestellungen sehen)
router.get("/:id", protect, isAdmin, getOrderById);

// Return an order (only the owner can return their own orders)
router.post("/:id/return", protect, returnOrder);

// Erstelle eine neue Bestellung (alle Nutzer)
router.post("/", protect, createOrder);

// Lösche eine Bestellung (nur Admins oder der Ersteller)
router.delete("/:id", protect, deleteOrder);

export default router;