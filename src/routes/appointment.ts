import { Router } from 'express';
import { create, findAll, findSlotsWithDetailId, untaken } from '../controllers/appointment';
const router = Router();

// Creates an appointment
router.post('/', create);

//find all appointment
router.get('/', findAll);

// lists all the appointments not taken by the student
router.get('/untaken', untaken);

//find all appointment in the Detail Id
router.get('/:id', findSlotsWithDetailId);

export { router as AppointmentRouter };
