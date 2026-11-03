import express from 'express';
import { ConsultationController } from './consultation.controller';

const router = express.Router();

router.post('/book', ConsultationController.bookConsultation);
router.get('/', ConsultationController.getAllConsultations);
router.get('/:roomId', ConsultationController.getConsultationByRoomId);
router.patch('/assign/:id', ConsultationController.assignDoctor);
router.patch('/status/:id', ConsultationController.updateStatus);
router.post('/prescription/:id', ConsultationController.savePrescription);

export const ConsultationRoute = router;

