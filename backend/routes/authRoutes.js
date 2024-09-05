// authRoutes.js
import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// Login-Route
router.post('/login', loginUser);
// Registrierung eines neuen Benutzers - keine Authentifizierung erforderlich
router.post('/register', registerUser);

export default router;