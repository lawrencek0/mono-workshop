import { Router } from 'express';
import { AuthRouter } from './auth';
import { AppointmentRouter } from './appointment';
import { UserRouter } from './user';
import { validate } from '../controllers/auth';
import { SlotRouter } from './slot';
import { EmailRouter } from './email';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', validate, AppointmentRouter);
router.use('/users', UserRouter);
router.use('/slots', validate, SlotRouter);
router.use('/emails', validate, EmailRouter);
export default router;
