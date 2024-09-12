import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routen
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', protect, userRoutes); // Schütze die Benutzerrouten
app.use('/api/admins', protect, adminRoutes); // Schütze die Adminrouten
app.use('/api/orders', protect, orderRoutes); // Schütze die Bestellrouten
app.use('/api/wishlist', protect, wishlistRoutes); // Schütze die Wunschlistenrouten

// Fehlerbehandlung
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 1312;

app.listen(PORT, () =>
  console.log(`\x1b[36mServer running on port ${PORT}\x1b[0m`)
);

export default app;