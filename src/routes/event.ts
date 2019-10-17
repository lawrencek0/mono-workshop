import { Router } from 'express';
import { create, fetchEvents, fetchEvent } from '../controllers/event';
const router = Router();

router.post('/', create);
router.get('/', fetchEvents);

router.get('/:eventId', fetchEvent);

export { router as EventRouter };
