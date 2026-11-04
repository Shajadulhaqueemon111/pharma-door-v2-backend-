import express from 'express';
import { notificationController } from './notification.controller';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  notificationController.getNotifications,
);

router.patch(
  '/:id/read',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  notificationController.upadteRead,
);

router.patch(
  '/read-all',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  notificationController.updatedAllAsRead,
);

export const notificationRouter = router;
