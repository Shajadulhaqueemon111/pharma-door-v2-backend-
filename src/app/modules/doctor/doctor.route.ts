import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.post('/seed', DoctorController.seedDoctors);
router.post('/', DoctorController.createDoctor);
router.get('/', DoctorController.getAllDoctors);
router.get('/:id', DoctorController.getDoctorById);
router.patch('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deleteDoctor);

export const DoctorRoute = router;

