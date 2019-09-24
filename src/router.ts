import { Router } from 'express';
import { AuthRouter } from './auth/router';
import { AppointmentRouter } from './appointments/router';
import { validate } from './auth/controller';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', validate, AppointmentRouter);
export default router;
