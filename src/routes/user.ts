import { Router } from 'express';
import * as userService from '../controllers/user';

const router = Router();
//list All users
router.get('/', userService.listAllUsers);

//list All students(not completed)
router.get('/students', userService.listAllStudents);

router;

export { router as UserRouter };
