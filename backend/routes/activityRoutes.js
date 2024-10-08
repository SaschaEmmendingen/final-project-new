import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Hole alle Aktivitäten für den angemeldeten Benutzer
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Sortiere nach Datum absteigend

    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;