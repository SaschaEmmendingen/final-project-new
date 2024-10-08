import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dein_geheimer_schluessel';

// Test: Token-Erstellung und Verifizierung
const testToken = () => {
  const testPayload = { id: 'test123', role: 'user' };
  const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1h' });

  console.log('Generated Token:', token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token successfully verified:', decoded);
    console.log('(tt2)JWT_SECRET in authController:', JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
  }
};

testToken();