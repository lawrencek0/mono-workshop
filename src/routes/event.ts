import { Router } from 'express';
import { create, getUserEvents, getEventUsers, shareEvent } from '../controllers/event';
const router = Router();

router.post('/', create);
router.get('/', getUserEvents);

router.get('/:id', getEventUsers);
router.post('/:id', shareEvent);

export { router as EventRouter };
