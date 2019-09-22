import { Router } from 'express';
import { AuthRouter } from './auth/router';
import { AppointmentRouter } from './appointments/router';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', AppointmentRouter);
export default router;
