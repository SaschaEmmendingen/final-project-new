import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import jwt from 'jsonwebtoken';

dotenv.config();
console.log('JWT_SECRET in server.js:', process.env.JWT_SECRET); // Debugging

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

// Token-Authentifizierungsmiddleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Received Token:', token); // Debugging-Zwecke

  if (token == null) return res.sendStatus(401); // Kein Token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token Verification Error:', err); // Debugging-Zwecke
      return res.sendStatus(403); // Ungültiger Token
    }
    req.user = user;
    next();
  });
};

// Routen
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Middleware für geschützte Routen
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/admins', authenticateToken, adminRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);

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

