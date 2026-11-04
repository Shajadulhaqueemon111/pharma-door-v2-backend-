import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?._id || req.user?.userId;
  const notifications = await NotificationService.getUserNotifications(userId);
  res.json({
    success: true,
    data: notifications,
  });
};

const upadteRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isRead = req.body?.read !== undefined ? req.body.read : true;
  const updated = await NotificationService.updatedNotificationAsRead(id, isRead);
  res.json({
    success: true,
    data: updated,
  });
};

const updatedAllAsRead = async (req: Request, res: Response) => {
  const userId = req.user?._id || req.user?.userId;
  await NotificationService.updaetAllNotificationsAsRead(userId);
  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
};

export const notificationController = {
  getNotifications,
  upadteRead,
  updatedAllAsRead,
};
