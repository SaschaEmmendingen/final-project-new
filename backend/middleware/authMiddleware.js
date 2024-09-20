import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Admin from '../models/Admin.js'; // Importiere das Admin-Modell

const JWT_SECRET = process.env.JWT_SECRET || 'dein_geheimer_schluessel';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Konvertiere die ID in ObjectId
      const userId = new mongoose.Types.ObjectId(decoded.id);

      // Suche den Benutzer in der `users`-Collection
      let user = await User.findById(userId).select('-password');

      // Falls nicht gefunden, suche in der `admins`-Collection
      if (!user) {
        user = await Admin.findById(userId).select('-password');
      }

      // console.log('Found User:', user);

      if (!user) {
        console.log('User not found in database');
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }

      req.user = user;


      next();
    } catch (error) {
      console.error('Token Error:', error);
      res.status(401).json({ message: 'Nicht autorisiert, Token ungültig' });
    }
  } else {
    return res.status(401).json({ message: 'Nicht autorisiert, kein Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert, Admin-Rechte erforderlich' });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};