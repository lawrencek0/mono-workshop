import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, selectAppointment, findAll } from '../controllers/appointment';
const router = Router();

// Creates an appointment
router.post('/', create);

//router.put('/', selectAppointment);

//find all appointment
router.get('/', findAll);

router.put('/:detailId/:slotId', selectAppointment);

export { router as AppointmentRouter };
