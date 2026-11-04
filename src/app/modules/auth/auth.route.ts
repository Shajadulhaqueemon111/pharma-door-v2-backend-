import express from 'express';
import { authController } from './auth.controller';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/register', authController.register);
router.post('/verify-registration-otp', authController.verifyRegistrationOtp);
router.post('/resend-otp', authController.resendOtp);

router.post('/login', authController.loginUser);
router.post('/verify-2fa', authController.verify2FA);

router.patch(
  '/toggle-2fa',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  authController.toggle2FA,
);

router.patch(
  '/change-password',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  authController.changePassword,
);

router.get(
  '/sessions',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  authController.getSessions,
);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export const LoginRouetr = router;
