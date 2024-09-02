import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/authMiddleware.js'; // Admin Middleware
import Order from '../models/Order.js';
import { createOrder, deleteOrder, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

// Hole alle Bestellungen (nur Admins)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hole Bestellungen für den angemeldeten Benutzer
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hole eine Bestellung nach ID (Admin kann alle Bestellungen sehen)
router.get('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Erstelle eine neue Bestellung (alle Nutzer)
router.post('/', authMiddleware, createOrder);

// Lösche eine Bestellung (nur Admins oder der Ersteller)
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

export default router;