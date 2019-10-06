import { Router } from 'express';
import { AuthRouter } from './auth';
import { AppointmentRouter } from './appointment';
import { UserRouter } from './user';
import { validate } from '../controllers/auth';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', validate, AppointmentRouter);
router.use('/users', UserRouter);
export default router;
