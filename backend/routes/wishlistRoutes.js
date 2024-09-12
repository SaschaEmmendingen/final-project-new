import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// GET Wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });
    res.json(wishlist);
  } catch (error) {
    console.error('GET Wishlist Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST Add item to Wishlist
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, name, price } = req.body;
  const userId = req.user.id;

  console.log('Request body:', req.body);
  console.log('User ID:', userId);

  try {
    if (!productId || !name || !price) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    wishlist.items.push({ productId, name, price });
    await wishlist.save();

    // Log the activity for adding to wishlist
    const activity = {
      type: 'Wishlist Updated',
      description: `Produkt #${productId} wurde zur Wunschliste hinzugefügt.`,
    };
    await User.findByIdAndUpdate(
      userId,
      { $push: { activities: activity } },
      { new: true }
    );

    res.json(wishlist);
  } catch (error) {
    console.error('POST Add Item Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE Remove item from Wishlist
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== req.params.productId
    );

    await wishlist.save();

    // Log the activity for removing from wishlist
    const activity = {
      type: 'Wishlist Updated',
      description: `Produkt #${req.params.productId} wurde von der Wunschliste entfernt.`,
    };
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { activities: activity } },
      { new: true }
    );

    res.json(wishlist);
  } catch (error) {
    console.error('DELETE Remove Item Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;