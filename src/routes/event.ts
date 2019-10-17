import { Router } from 'express';
import { create, getUserEvents, getEventUsers } from '../controllers/event';
const router = Router();

router.post('/', create);
router.get('/', getUserEvents);

router.get('/:id', getEventUsers);

export { router as EventRouter };
