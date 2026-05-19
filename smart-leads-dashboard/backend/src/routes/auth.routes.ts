import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import {
  updateProfileHandler,
  changePasswordHandler,
  deleteAccountHandler,
} from '../controllers/settings.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../schemas/settings.schema';
import { authMiddleware } from '../middleware/auth.middleware';

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

/**
 * @route  PUT /api/auth/profile
 * @desc   Update authenticated user's name and/or email
 * @access Private
 */
router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  updateProfileHandler
);

/**
 * @route  PUT /api/auth/password
 * @desc   Change authenticated user's password
 * @access Private
 */
router.put(
  '/password',
  authMiddleware,
  validate(changePasswordSchema),
  changePasswordHandler
);

/**
 * @route  DELETE /api/auth/account
 * @desc   Permanently delete authenticated user's account
 * @access Private
 */
router.delete('/account', authMiddleware, deleteAccountHandler);

export default router;
