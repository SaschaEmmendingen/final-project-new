import express from "express";
import Product from "../models/Product.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Route für die Produktsuche nach Namen
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query; // Holt den Namen aus den Query-Parametern
    if (!name) {
      return res
        .status(400)
        .json({ message: "Bitte einen Produktnamen angeben." });
    }

    const products = await Product.find({ name: new RegExp(name, "i") }); // Sucht nach Produkten mit dem Namen
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Suchen der Produkte" });
  }
});

// Alle Produkte anzeigen
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Produkt anhand der ID anzeigen
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Ungültige ID." });
  }

  try {
    const product = await Product.findById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Produkt hinzufügen
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !description || !price || !category || !stock || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Alle Felder müssen ausgefüllt werden." });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Serverfehler:", error);
    res
      .status(500)
      .json({ message: "Serverfehler beim Hinzufügen des Produkts" });
  }
});

// Route zum Erstellen mehrerer Produkte
router.post("/bulk", async (req, res) => {
  try {
    const products = req.body; // Dies sollte ein Array von Produkten sein

    // Überprüfe, ob products definiert ist und ein Array ist
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Body muss ein Array von Produkten sein." });
    }

    // Überprüfe, ob alle Produkte das imageUrl-Feld enthalten
    for (const product of products) {
      if (
        !product.name ||
        !product.description ||
        !product.price ||
        !product.category ||
        !product.stock ||
        !product.imageUrl
      ) {
        return res.status(400).json({
          error: "Alle Produkte müssen alle erforderlichen Felder enthalten.",
        });
      }
    }

    // Erstellen mehrerer Produkte in der Datenbank
    const result = await Product.insertMany(products);
    res.status(201).json(result);
  } catch (error) {
    console.error(error); // Protokolliere den Fehler
    res.status(400).json({ error: error.message });
  }
});

// Produkt bearbeiten
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.imageUrl = imageUrl || product.imageUrl; // Bild-URL aktualisieren

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Produkt löschen
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
