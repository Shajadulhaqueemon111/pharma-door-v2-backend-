import express from 'express';
import { notificationController } from './notification.controller';

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.upadteRead);
router.patch('/read-all', notificationController.updatedAllAsRead);

export const notificationRouter = router;
