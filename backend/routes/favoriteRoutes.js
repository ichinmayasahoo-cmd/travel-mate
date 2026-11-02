import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
import { requireDb } from '../middleware/errorHandler.js';

const router = Router();
router.use(requireDb, protect);
router.get('/', getFavorites);
router.post('/:id', addFavorite);
router.delete('/:id', removeFavorite);
export default router;
