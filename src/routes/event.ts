import { Router } from 'express';
import { create, getUserEvents } from '../controllers/event';
const router = Router();

router.post('/', create);
router.get('/', getUserEvents);

export { router as EventRouter };
