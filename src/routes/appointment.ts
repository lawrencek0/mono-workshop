import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, findAll, findSlotsWithDetailId, untaken } from '../controllers/appointment';
const router = Router();

// Creates an appointment
router.post('/', create);

//find all appointment
router.get('/', findAll);

router.get('/untaken', untaken);

//find all appointment in the Detail Id
router.get('/:id', findSlotsWithDetailId);

export { router as AppointmentRouter };
