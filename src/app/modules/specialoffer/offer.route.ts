import express from 'express';
import { OfferController } from './offer.controller';
import authValidateRequest from '../../middlewares/auth.validationRequest';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { OfferZodValidationSchema } from './offer.zodValidation';
import { upload } from '../utils/sendToimgeCloudinary';

const route = express.Router();

route.post(
  '/create-offer',
  authValidateRequest(USER_ROLE.pharmacist),
  upload.single('medicineImage'),
  validateRequest(OfferZodValidationSchema.offerMedicineZodSchema),
  OfferController.createOffer,
);
route.get('/', OfferController.getAllOffer);
route.get('/:id', OfferController.getSingleOffer);
route.patch(
  '/:_id',
  authValidateRequest(USER_ROLE.pharmacist),
  validateRequest(OfferZodValidationSchema.offerMedicineUpdateZodSchema),
  OfferController.updateOffer,
);
route.delete(
  '/:_id',
  authValidateRequest(USER_ROLE.pharmacist),
  OfferController.deleteOffer,
);

export const OfferRoute = route;
