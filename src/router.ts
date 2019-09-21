import { Router } from 'express';
import { AuthRouter } from './auth/router';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);

export default router;
