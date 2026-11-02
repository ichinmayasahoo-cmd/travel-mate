import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireDb } from '../middleware/errorHandler.js';

const router = Router();
router.post('/register', requireDb, register);
router.post('/login', requireDb, login);
router.get('/me', requireDb, protect, me);
export default router;
