import { Router } from 'express';
import { AuthRouter } from './auth/router';
import { AppointmentRouter } from './appointment/router';
import { UserRouter } from './user/router';
import { validate } from './auth/controller';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', validate, AppointmentRouter);
router.use('/users', UserRouter);
export default router;
