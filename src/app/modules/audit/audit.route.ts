import express from 'express';
import { AuditController } from './audit.controller';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),
  AuditController.getAuditLogs,
);

router.post(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  AuditController.createAuditLog,
);

export const AuditRoutes = router;
