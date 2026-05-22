import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userZodValidationScema } from './user.validation';
import { adminZodValidationSchema } from '../admin/admin.validation';
import { pharmacistZodValidationSchema } from '../phermasist/phermasist.validation';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from './user.constant';
import { upload } from '../utils/sendToimgeCloudinary';

const router = express.Router();

router.post(
  '/create-user',

  UserController.createUsers,
);
router.post(
  '/create-admin',
  validateRequest(adminZodValidationSchema.createAdminValidationSchema),
  UserController.createAdmin,
);
router.post(
  '/create-phermasist',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'drugLicenseImage', maxCount: 1 },
    { name: 'nidImage', maxCount: 1 },
    { name: 'tradeLicenseImage', maxCount: 1 },
  ]),

  (req: Request, res: Response, next: NextFunction) => {
    console.log('Files:', req.files);
    req.body = JSON.parse(req.body.body.trim());
    console.log('After parse:', req.body);
    next();
  },
  validateRequest(
    pharmacistZodValidationSchema.createPharmacistValidationSchema,
  ),
  UserController.createPhermasist,
);
router.get(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),

  UserController.getAllUser,
);
router.get('/:id', UserController.getSingleUser);
router.patch(
  '/:id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),

  validateRequest(userZodValidationScema.updatedUserZodSchema),
  UserController.updatedUser,
);
router.delete('/:id', UserController.deletedUser);

export const UserRoutes = router;
