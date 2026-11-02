import { Router } from 'express';
import { generate, createTrip, listTrips, deleteTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';
import { requireDb } from '../middleware/errorHandler.js';

const router = Router();
router.post('/generate', generate); // works without a database
router.post('/', requireDb, protect, createTrip);
router.get('/', requireDb, protect, listTrips);
router.delete('/:id', requireDb, protect, deleteTrip);
export default router;
