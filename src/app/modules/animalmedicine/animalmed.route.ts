import express from 'express';
import { AnimalMedicineController } from './animalmedicine.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  CreateanimalMedicineZodSchema,
  UpdateanimalMedicineZodSchema,
} from './animalmed.zodvalidation';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';

const route = express.Router();

route.post(
  '/create-animalmedicine',
  authValidateRequest(USER_ROLE.pharmacist),
  AnimalMedicineController.createAnimalmedicine,
  validateRequest(CreateanimalMedicineZodSchema),
);
route.get('/', AnimalMedicineController.getAllMedicineIntoDB);
route.get('/:id', AnimalMedicineController.getSingleMedicine);
route.patch(
  '/:_id',
  authValidateRequest(USER_ROLE.pharmacist),
  AnimalMedicineController.updateMedicine,
  validateRequest(UpdateanimalMedicineZodSchema),
);
route.delete(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  AnimalMedicineController.deleteMedicine,
);

export const AnimalMedicineRoute = route;
