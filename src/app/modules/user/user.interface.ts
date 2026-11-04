import { USER_ROLE } from './user.constant';

export interface IUserSession {
  _id?: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  lastActive: Date;
  current?: boolean;
}

export interface IUser {
  name: string;
  profileImage: string;
  status?: 'pending' | 'approved' | 'rejected';
  email: string;
  password: string;
  role: 'user' | 'admin' | 'pharmacist';
  twoFactorEnabled?: boolean;
  twoFactorOtp?: string;
  twoFactorOtpExpires?: Date;
  twoFactorAttempts?: number;
  penaltyUntil?: Date;
  isEmailVerified?: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpires?: Date;
  sessions?: IUserSession[];
}

export type TUserRole = keyof typeof USER_ROLE;
