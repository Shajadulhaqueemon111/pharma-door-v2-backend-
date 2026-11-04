import NotificationModel from './notification.modle';

const createNotification = async (userId: string, message: string) => {
  return await NotificationModel.create({
    user: userId,
    message,
    read: false,
    createdAt: new Date(),
  });
};

const getUserNotifications = async (userId: string) => {
  return await NotificationModel.find({ user: userId }).sort({ createdAt: -1 });
};

const updatedNotificationAsRead = async (
  notificationId: string,
  read: boolean = true,
) => {
  return await NotificationModel.findByIdAndUpdate(
    notificationId,
    { read },
    { new: true },
  );
};

const updaetAllNotificationsAsRead = async (userId: string) => {
  return await NotificationModel.updateMany(
    { user: userId },
    { $set: { read: true } },
  );
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  updaetAllNotificationsAsRead,
  updatedNotificationAsRead,
};
