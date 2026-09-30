import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.middleware.js';
import { userRegistrationSchema, userLoginSchema } from '../validations/auth.validation.js';

const router = express.Router();

// public routes
router.post('/register', validate(userRegistrationSchema), register);
router.post('/login', validate(userLoginSchema), login);

// protected routes
router.get('/me', auth, getMe);

export default router;
