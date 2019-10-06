import { Router } from 'express';
import { AuthRouter } from './auth';
import { AppointmentRouter } from './appointment';
import { UserRouter } from './user';
import { validate } from '../controllers/auth';
import { SlotRouter } from './slot';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', validate, AppointmentRouter);
router.use('/users', UserRouter);
router.use('/slots', SlotRouter);
export default router;
