import express from 'express';
import { createAdmin, getAdmin, getAllAdmins, updateAdmin, deleteAdmin, getAdminDashboard } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-CRUD und Dashboard Routen
router.use(protect); // Authentifizierung erforderlich
router.use(isAdmin); // Nur Admins haben Zugriff auf diese Routen

router.post('/', createAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

// Admin-Dashboard
router.get('/dashboard', getAdminDashboard);

export default router;