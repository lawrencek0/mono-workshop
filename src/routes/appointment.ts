import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, findAll, findSlotsWithDetailId } from '../controllers/appointment';
const router = Router();

// Creates an appointment
router.post('/', create);

//find all appointment
router.get('/', findAll);
//find all appointment in the Detail Id
router.get('/:id', findSlotsWithDetailId);

export { router as AppointmentRouter };
