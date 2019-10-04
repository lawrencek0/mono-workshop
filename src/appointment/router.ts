import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, findAll, findByFacultyId, selectAppointment } from './service';
const router = Router();

// Creates an appointment
router.post('/', create);

//router.put('/', selectAppointment);

//find all appointment
router.get('/', findAll);

router.post('/select', selectAppointment);

// gets all appointments for the faculty
router.get('/faculty', findByFacultyId);

export { router as AppointmentRouter };
