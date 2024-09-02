import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Nicht autorisiert, kein Token vorhanden' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('role'); // Nur die Rolle laden

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Zugriff verweigert, keine Admin-Rechte' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Fehler bei der Admin-Überprüfung:', error);
    res.status(401).json({ message: 'Fehler bei der Authentifizierung', error });
  }
};

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Kein Token, keine Authentifizierung' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Benutzer-Daten speichern, falls nötig
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Fehler bei der Authentifizierung', error });
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Kein Token, keine Authentifizierung' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token ist nicht gültig' });
  }
};

export default authMiddleware;