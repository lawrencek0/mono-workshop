import { Router } from 'express';
import { create } from '../controllers/event';
const router = Router();

router.post('/', create);

export { router as EventRouter };
