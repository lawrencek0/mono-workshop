import { Router } from 'express';
import { update, findTakenSlots } from '../controllers/slot';
const router = Router();

router.patch('/:id', update);

router.get('/:id', findTakenSlots);

export { router as SlotRouter };
