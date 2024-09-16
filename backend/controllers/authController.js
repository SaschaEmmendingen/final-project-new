import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

dotenv.config(); // Muss vor allen anderen Imports sein

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const authenticateUser = async (email, password) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await Admin.findOne({ email });
  }

  if (!user) {
    throw new Error('Benutzer nicht gefunden');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Ungültige Anmeldedaten');
  }

  const token = generateToken(user);

  // Debugging: Logge den generierten Token und die darin gespeicherten Daten
  console.log('(AC) Generated Token:', token);
  console.log('(AC) Token Data:', { id: user._id, role: user.role });

  return { token, user };
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);
    res.json({
      token,
      name: user.name,
      role: user.role,
      email: user.email,
      address: user.address,
      phone: user.phone,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    // Überprüfen, ob der Benutzer bereits existiert
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer erstellen
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    if (user) {
      const token = generateToken(user);
      res.status(201).json({
        message: 'Registration successful',
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};