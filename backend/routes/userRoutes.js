import express from 'express';
import { registerUser, getUser, getAllUsers, updateUser, deleteUser, getUserProfile } from '../controllers/userController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registrierung - keine Authentifizierung erforderlich
router.post('/', registerUser);

// Alle weiteren Routen erfordern Authentifizierung 
router.use(protect); // Alle nachfolgenden Routen erfordern Authentifizierung

router.get('/profile', getUserProfile); // Profil-Details abrufen
router.get('/:id', getUser); // User nach ID abrufen
router.get('/', isAdmin, getAllUsers); // Alle Users abrufen (nur für Admins)
router.put('/:id', isAdmin, updateUser); // User nach ID aktualisieren (nur für Admins)
router.delete('/:id', isAdmin, deleteUser); // User nach ID löschen (nur für Admins)

export default router;