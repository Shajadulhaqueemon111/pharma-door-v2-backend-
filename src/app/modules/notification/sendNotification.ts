// utils/sendNotificationToPharmacist.ts

import NotificationModel from './notification.modle';

const sendNotificationToPharmacist = async (
  userId: string,
  message: string,
) => {
  await NotificationModel.create({
    user: userId,
    message,
    read: false,
    createdAt: new Date(),
  });
};

export default sendNotificationToPharmacist;
