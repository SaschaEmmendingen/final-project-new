import Order from '../models/Order.js'; // Importiere das Order Model
import express from "express";

const router = express.Router();


router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;

    // Validierung der Eingabedaten
    if (!items || !total) {
      return res.status(400).json({ message: 'Fehlende Daten' });
    }

    // Logge die erhaltenen Daten
    console.log('Empfangene Bestelldaten:', req.body);

    // Erstelle die Bestellung
    const newOrder = new Order({ items, total });
    await newOrder.save();

    res.status(201).json({ message: 'Bestellung erhalten!' });
  } catch (error) {
    console.error('Fehler bei der Bestellung:', error); // Detaillierte Fehlerprotokollierung
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});


export default router;
// router.post('/', async (req, res) => {
//     try {
//       const { items, total } = req.body;
  
//       // Validierung der Eingabedaten
//       if (!items || !total) {
//         return res.status(400).json({ message: 'Fehlende Daten' });
//       }
  
//       // Konvertiere die Preise von String zu Number
//       const formattedItems = items.map(item => ({
//         ...item,
//         price: parseFloat(item.price.replace('€', '').replace(',', '.').trim()),
//         quantity: item.quantity || 1, // Falls die Menge fehlt, setzen wir sie auf 1
//       }));
  
//       // Validierung, dass productId vorhanden ist
//       if (formattedItems.some(item => !item.productId)) {
//         return res.status(400).json({ message: 'Produkt ID fehlt' });
//       }
  
//       // Erstelle die Bestellung
//       const newOrder = new Order({ items: formattedItems, total });
//       await newOrder.save();
  
//       res.status(201).json({ message: 'Bestellung erhalten!' });
//     } catch (error) {
//       console.error('Fehler bei der Bestellung:', error);
//       res.status(500).json({ message: 'Serverfehler' });
//     }
//   });