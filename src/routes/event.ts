import { Router } from 'express';
import { create, fetchEvents, fetchEvent, shareEvent, update, deleteOne } from '../controllers/event';

const router = Router();

router.post('/', create);
router.post('/:eventId', shareEvent);
router.get('/', fetchEvents);
router.get('/:eventId', fetchEvent);
router.patch('/:id', update);
router.delete('/:id', deleteOne);

export { router as EventRouter };
