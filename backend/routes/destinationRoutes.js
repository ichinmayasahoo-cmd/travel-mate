import { Router } from 'express';
import { listDestinations, getDestination } from '../controllers/destinationController.js';

const router = Router();
router.get('/', listDestinations);
router.get('/:id', getDestination);
export default router;
