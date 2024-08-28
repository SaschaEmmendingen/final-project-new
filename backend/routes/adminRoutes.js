import express from 'express';
import { loginAdmin, createAdmin, getAdmin, getAllAdmins, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = express.Router();

// Admin-Login-Route
router.post('/login', loginAdmin);
// router.use(isAdmin);

// Admin-CRUD
router.post('/', createAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard', getAdminDashboard);

export default router;