import { Router } from 'express';
import { create, findOne, findAll, deleteAppointment } from './service';

const router = Router();

// Creates an appointment
router.post('/', create);
router.get('/:id', findOne);
router.get('/', findAll);
router.delete('/:id', deleteAppointment);
export { router as AppointmentRouter };
