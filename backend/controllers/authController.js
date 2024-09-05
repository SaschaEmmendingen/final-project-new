import dotenv from 'dotenv';
dotenv.config(); // Muss vor allen anderen Imports sein
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET;
console.log('(AC)JWT_SECRET in authController:', JWT_SECRET);

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

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

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
      phone: user.phone 
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};