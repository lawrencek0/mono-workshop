import { Router } from 'express';
import * as userController from '../controllers/auth';

const router = Router();

router.post('/login', userController.validateLogin, userController.postLogin);
router.post('/signup', userController.validateSignup, userController.postSignup);

export { router as AuthRouter };
