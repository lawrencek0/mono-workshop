import { Router } from 'express';
import { sender } from '../controllers/email';

const router = Router();

router.post('/', sender);

export { router as EmailRouter };
