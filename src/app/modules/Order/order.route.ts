import { Router } from 'express';
import {
  createOrderController,
  getAllOredrMedicines,
  getSingleOredrMedicines,
  updateOrderStatus,
} from './order.controller';

import { USER_ROLE } from '../user/user.constant';
import authValidateRequest from '../../middlewares/auth.validationRequest';

const router = Router();

router.post('/create', createOrderController);
router.get(
  '/ordered-medicine',
  authValidateRequest(USER_ROLE.pharmacist, USER_ROLE.admin),
  getAllOredrMedicines,
);
router.get(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  getSingleOredrMedicines,
);
router.patch(
  '/:_id',
  authValidateRequest(USER_ROLE.pharmacist),
  updateOrderStatus,
);
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  updateOrderStatus,
);

export const orderRoutes = router;
