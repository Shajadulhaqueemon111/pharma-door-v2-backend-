import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const notifications = await NotificationService.getUserNotifications(userId);
  res.json(notifications);
};

const upadteRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await NotificationService.updatedNotificationAsRead(id);
  res.json(updated);
};

const updatedAllAsRead = async (req: Request, res: Response) => {
  const userId = req.user._id;
  await NotificationService.updaetAllNotificationsAsRead(userId);
  res.json({ message: 'All notifications marked as read' });
};

export const notificationController = {
  getNotifications,
  upadteRead,
  updatedAllAsRead,
};
