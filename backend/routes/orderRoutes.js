import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js"; // Benannte Exporte importieren
import Order from "../models/Order.js";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  returnOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Hole alle Bestellungen (nur Admins)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("user");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Hole Bestellungen für den angemeldeten Benutzer
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .populate("user");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Hole eine Bestellung nach ID (Admin kann alle Bestellungen sehen)
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Return an order (only the owner can return their own orders)
router.post("/:id/return", protect, returnOrder);

// Erstelle eine neue Bestellung (alle Nutzer)
router.post("/", protect, createOrder);

// Lösche eine Bestellung (nur Admins oder der Ersteller)
router.delete("/:id", protect, deleteOrder);

export default router;
