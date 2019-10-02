import { Router } from 'express';
import * as userService from './service';

const router = Router();

router.post('/listAllUsers', userService.listAllUsers);

export { router as UserRouter };
