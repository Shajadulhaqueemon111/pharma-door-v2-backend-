import { Types } from 'mongoose';

export type TAdmin = {
  user: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  address: string;
};
