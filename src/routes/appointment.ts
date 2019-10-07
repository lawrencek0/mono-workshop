import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, findAll } from '../controllers/appointment';
const router = Router();

// Creates an appointment
router.post('/', create);

//find all appointment
router.get('/', findAll);

export { router as AppointmentRouter };
