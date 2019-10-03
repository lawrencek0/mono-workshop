import { Router } from 'express';
// import { create, findOne, findAll, deleteAppointment } from './service';
import { create, findAll, findByFacultyId } from './service';
const router = Router();

// Creates an appointment
router.post('/', create);
//find one appointment by appointment id
// router.get('/:id', findOne);

// //find all appointments that the user(currently loged in) made
// //router.get('/', findAllByUser);

//find all appointment
router.get('/', findAll);

// gets all appointments for the faculty
router.get('/faculty', findByFacultyId);

// //delete appointment by appointment id(appointId)
// router.delete('/:id', deleteAppointment);
export { router as AppointmentRouter };
