import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    console.log('JWT_SECRET during token generation:', process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Beispielverwendung
const user = { _id: '1234567890abcdef' }; // Dummy-User-ID für den Test
const token = generateToken(user._id);
console.log('Generated Token:', token);