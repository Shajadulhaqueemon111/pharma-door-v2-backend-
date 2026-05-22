// routes/medicine.routes.ts

import express from 'express';
import { MedicineController } from './medicine.controller';
import validateRequest from '../../middlewares/validateRequest';
import { medicineZodValidationSchema } from './medicine.zodevalidation';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../utils/sendToimgeCloudinary';

const router = express.Router();

router.post(
  '/',
  // validateRequest(medicineZodValidationSchema.createMedicineValidationSchema),
  MedicineController.createMedicine,
);
router.get(
  '/',
  // authValidateRequest(USER_ROLE.pharmacist, USER_ROLE.admin),
  MedicineController.getAllMedicines,
);
router.get(
  '/:id',
  // authValidateRequest(USER_ROLE.pharmacist, USER_ROLE.admin),
  MedicineController.getSingleMedicines,
);
router.post(
  '/prescription',
  authValidateRequest(USER_ROLE.pharmacist, USER_ROLE.user),
  upload.single('prescription'),
  MedicineController.checkPrescriptionMedicinesFromImage,
);
router.patch(
  '/:_id',
  validateRequest(medicineZodValidationSchema.updateMedicineValidationSchema),
  authValidateRequest(USER_ROLE.pharmacist),
  MedicineController.updateMedicines,
);
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  MedicineController.deleteMedicines,
);

export const MedicineRoute = router;
