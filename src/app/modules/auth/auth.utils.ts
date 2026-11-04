import AppError from '../../error/app.error';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import User from '../user/user.modle';

export const validUserForLogin = async (email: string) => {
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
  }

  const cleanEmail = email.trim();
  const user = await User.findOne({
    email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') },
  }).select('+status +password');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found in system');
  }

  return user;
};

export const checkPassword = async (
  givenPassword: string,
  savePassword: string,
) => {
  const isMatched = await bcrypt.compare(givenPassword, savePassword);
  if (!isMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  return isMatched;
};
