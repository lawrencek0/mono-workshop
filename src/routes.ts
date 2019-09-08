export{};
import express from 'express';
const router = express.Router();
import authController from '../../team-yellow-server/src/AuthCont';

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/validate', authController.validate_token);

module.exports = router; 
export default exports;