import express from 'express';
import { getNotifications, sendNotificationToAdmin, clearAllNotifications, deleteNotificationById, sendNotificationToUsers } from '../controllers/notifyController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Bestehende Routen
router.post('/notifications', sendNotificationToAdmin);
router.post('/send', protect, isAdmin, sendNotificationToUsers);
router.get('/notifications', protect, isAdmin, getNotifications);
router.delete('/clear-notifications', protect, isAdmin, clearAllNotifications);

// Neue Route zum Löschen einer einzelnen Benachrichtigung
router.delete('/notifications/:id', protect, isAdmin, deleteNotificationById);

export default router;
