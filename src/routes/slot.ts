import { Router } from 'express';
import { update } from '../controllers/slot';
const router = Router();

router.patch('/:id', update);

export { router as SlotRouter };
