import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; // user (e.g., pharmacist) who receives the notification
  message: string; // notification text
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema<INotification>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Adjust this based on your user model name
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model<INotification>(
  'Notification',
  notificationSchema,
);
export default NotificationModel;
