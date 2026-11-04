/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bycript from 'bcryptjs';
import config from '../../config';

const sessionSchema = new Schema({
  ip: { type: String, default: '127.0.0.1' },
  device: { type: String, default: 'Desktop Computer' },
  browser: { type: String, default: 'Chrome' },
  os: { type: String, default: 'Windows' },
  location: { type: String, default: 'Dhaka, Bangladesh' },
  lastActive: { type: Date, default: Date.now },
  current: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'pharmacist'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorOtp: {
      type: String,
    },
    twoFactorOtpExpires: {
      type: Date,
    },
    twoFactorAttempts: {
      type: Number,
      default: 0,
    },
    penaltyUntil: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    emailVerificationOtp: {
      type: String,
    },
    emailVerificationOtpExpires: {
      type: Date,
    },
    sessions: [sessionSchema],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bycript.hash(
      user.password,
      Number(config.bcrypt_salt_rounds) || 10,
    );
  }
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
