import express from 'express';
import { PhermasistController } from './phermasist.controller';
import validateRequest from '../../middlewares/validateRequest';
import { pharmacistZodValidationSchema } from './phermasist.validation';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  authValidateRequest(USER_ROLE.admin),
  PhermasistController.getAllPhermasist,
);
router.get('/:id', PhermasistController.getSinglePhermasist);
router.patch(
  '/:id',
  validateRequest(
    pharmacistZodValidationSchema.updatePharmacistValidationSchema,
  ),
  PhermasistController.updatePhermasist,
);
router.delete('/:id', PhermasistController.deletePhermasist);

export const PhermasistRoute = router;
