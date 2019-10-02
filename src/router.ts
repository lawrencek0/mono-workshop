import { Router } from 'express';
import { AuthRouter } from './auth/router';
import { AppointmentRouter } from './appointment/router';
// import { validate } from './auth/controller';

// Route handlers

const router = Router();

router.use('/auth', AuthRouter);
router.use('/appointments', AppointmentRouter);
export default router;
