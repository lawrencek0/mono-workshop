import { Router } from 'express';
import { update } from '../controllers/slot';
const router = Router();

router.put('/:id', update);

export { router as SlotRouter };
