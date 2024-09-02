import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Deine Frontend-Adresse
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Definiere die Routen
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes); // Routen für Bestellungen
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fehlerbehandlung für ungültige Routen
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Fehlerbehandlung für andere Fehler
app.use((err, req, res, next) => {
  console.error(err.stack); // Protokolliere den Fehlerstapel
  res.status(500).json({ message: "Server Error" }); // Sende eine generische Fehlermeldung
});

const PORT = process.env.PORT || 1312;

app.listen(PORT, () =>
  console.log(`\x1b[36mServer running on port ${PORT}\x1b[0m`)
);

export default app;