import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminZodValidationSchema } from './admin.validation';

const router = express.Router();

router.get('/', AdminController.getAllAdmin);
router.get('/:id', AdminController.getSingleAdmin);
router.patch(
  '/',
  validateRequest(adminZodValidationSchema.updateAdminValidationSchema),
  AdminController.updateAdmin,
);

export const AdminRoute = router;
