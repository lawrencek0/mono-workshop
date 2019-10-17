import { Router } from 'express';
import { create, fetchEvents, fetchEvent, shareEvent } from '../controllers/event';

const router = Router();

router.post('/', create);
router.get('/', fetchEvents);

router.get('/:eventId', fetchEvent);
router.post('/:eventId', shareEvent);

export { router as EventRouter };
