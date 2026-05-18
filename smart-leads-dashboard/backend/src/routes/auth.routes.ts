import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user and return JWT
 * @access Public
 */
router.post('/login', validate(loginSchema), login);

export default router;
