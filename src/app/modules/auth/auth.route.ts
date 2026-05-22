import express from 'express';
import { authController } from './auth.controller';

import { loginZodValidationSchema } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.post(
  '/login',
  validateRequest(loginZodValidationSchema.loginValidationSchema),
  authController.loginUser,
);
router.post(
  '/refresh-token',
  validateRequest(loginZodValidationSchema.refreshTokenValidationSchema),
  authController.refreshToken,
);
router.post(
  '/logout',

  authController.logout,
);

export const LoginRouetr = router;
