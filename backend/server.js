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
import notifyAdminRoutes from './routes/notifyRoute.js'; // Importiere die Benachrichtigungsrouten
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Definiere die Routen
app.use('/api/notify-admin', notifyAdminRoutes); // Route für Benachrichtigungen
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/admins", protect, adminRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/wishlist", protect, wishlistRoutes);

// Fehlerbehandlung
app.use((req, res, next) => {
  console.log("Fehlerbehandlung: 404 Not Found");
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Fehlerbehandlung: Server Error", err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 1312;

const server = app.listen(PORT, () =>
  console.log(`\x1b[36mServer listening on Port ${PORT}\x1b[0m`)
);
