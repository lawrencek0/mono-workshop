import { Router } from 'express';
import { create, findOne, findAll } from './service';

const router = Router();

// Creates an appointment
router.post('/', create);
router.get('/:id', findOne);
router.get('/', findAll);
export { router as AppointmentRouter };
