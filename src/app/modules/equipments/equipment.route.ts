import express from 'express';
import { EquipmentController } from './equipments.controller';

import { USER_ROLE } from '../user/user.constant';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { upload } from '../utils/sendToimgeCloudinary';

const router = express();

router.post(
  '/create-equipment',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),
  EquipmentController.createEquipment,
);
router.get(
  '/',
  // authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  EquipmentController.getAllEquipment,
);
router.get(
  '/:id',
  // authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist, USER_ROLE.user),
  EquipmentController.getSingleEquipment,
);
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),
  EquipmentController.deleteEquipment,
);
router.patch(
  '/:_id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.pharmacist),
  upload.single('medicineImage'),
  EquipmentController.updateEquipment,
);

export const EquipmentRoute = router;
